
import "reflect-metadata"
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { createConnection } from 'typeorm'

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

const serverStart = async () => {

  await createConnection();

  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const server = new ApolloServer({ schema });

  const app = Express();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("🚀 server started on http://localhost:4000/graphql");
  });
};

serverStart();
