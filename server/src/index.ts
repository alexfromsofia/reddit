import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

import mikroOrmConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { __prod__ } from "./constants";

const main = async () => {
  // Connect to DB
  const orm = await MikroORM.init(mikroOrmConfig);
  // Run migrations
  await orm.getMigrator().up();

  // Setup express server
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // Setup redis session
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "yoid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5, // 5 years
        httpOnly: true,
        sameSite: "lax", // csrf - TODO: google
        secure: __prod__, // use cookie only on https
      },
      secret: "make_this_env_var",
      resave: false,
      saveUninitialized: false,
    })
  );

  // Setup GraphQL server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
