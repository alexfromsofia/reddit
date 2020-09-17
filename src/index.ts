import express from "express";
import { MikroORM } from "@mikro-orm/core";

// import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  // Connect to DB
  const orm = await MikroORM.init(mikroOrmConfig);
  // Run migrations
  await orm.getMigrator().up();

  // Setup express server
  const app = express();

  // Setup GraphQL server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({ resolvers: [HelloResolver], validate: false }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
