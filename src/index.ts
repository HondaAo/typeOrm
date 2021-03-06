
import "reflect-metadata"
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from 'typeorm'
import { RegisterResolver } from "./user/Register";
import session from 'express-session';
import connectRedis from 'connect-redis'
import { redis } from './redis';
import { LoginResolver } from "./user/Login";
import { MeResolver } from "./user/me";
import { LogoutResolver } from "./user/Logout";



const serverStart = async () => {

  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver, LogoutResolver],
    authChecker: ({ context: { req } } ) => {
      if(req.session.userId){
        return true 
      }
      return false
    }
  });

  const server = new ApolloServer({ 
  schema,
  context: ({ req }: any) => ({ req })
});

  const app = Express();

  const RedisStore = connectRedis(session)

  app.use(
    session({
      store: new RedisStore({
        client: redis as any
      }),
      name: "typeorm",
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365
      }
    })
);

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("🚀 server started on http://localhost:4000/graphql");
  });
};

serverStart();
