import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import dotenv from "dotenv";
import corsOptions from "./config/corsOptions";
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
import { GraphQLContext, Session } from "./util/types";

import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express from "express";
import http from "http";

async function startApolloServer() {
  dotenv.config();
  const PORT = parseInt(process.env.PORT as string) || 5000;
  const prisma = new PrismaClient();
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = (await getSession({ req })) as Session;
      return { session, prisma };
    },
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

startApolloServer().catch((err: any) => console.log(err));
