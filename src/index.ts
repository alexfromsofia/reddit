import { MikroORM } from "@mikro-orm/core";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {
  // Connect to DB
  const orm = await MikroORM.init(mikroOrmConfig);
  // Run migrations
  await orm.getMigrator().up();
  // Run SQL
  // const post = orm.em.create(Post, { title: "My first post" });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
