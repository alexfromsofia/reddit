import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { v4 } from 'uuid';

import { MyContext } from '../types';
import { User } from '../entities/User';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';
import { getConnection } from 'typeorm';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // Allow requesting only current user's email
    if (req.session.userId === user.id) {
      return user.email;
    }

    return '';
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [{ field: 'newPassword', message: 'length must be greater thant 2' }]
      };
    }
    const key = `${FORGET_PASSWORD_PREFIX}${token}`;
    const userId = await redis.get(key);

    if (!userId) {
      return {
        errors: [{ field: 'token', message: 'token expired' }]
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [{ field: 'token', message: 'user no longer exists' }]
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword)
      }
    );
    await redis.del(key);

    // Login user after changing password
    req.session.userId = userId;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg('email') email: string, @Ctx() { redis }: MyContext) {
    const user = await User.findOne({ where: { email } });
    // Email is not in the DB
    if (!user) return true;
    const token = v4();
    await redis.set(
      `${FORGET_PASSWORD_PREFIX}${token}`,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3 // 3days
    );

    sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
    return true;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;

    try {
      // Same as User.create({...}).save()
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          password: hashedPassword,
          email: options.email
        })
        .returning('*')
        .execute();

      user = result.raw[0];
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate username code
        return {
          errors: [
            {
              field: 'username',
              message: 'Username already in use.'
            }
          ]
        };
      }
    }

    // Store userId session
    // This will set a cookie on the user and keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx()
    { req }: MyContext
  ): Promise<UserResponse> {
    const isEmail = usernameOrEmail.includes('@');
    const user = await User.findOne({
      where: isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
    });

    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: `${isEmail ? 'Email' : 'Username'} does not exist.`
          }
        ]
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'Incorrect password' }]
      };
    }

    // Store userId session
    // This will set a cookie on the user and keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Query(() => [User])
  async users() {
    const users = await User.find({});

    return users;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // Not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }
}
