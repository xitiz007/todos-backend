import { PrismaClient } from "@prisma/client";

// todos
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// creating server
export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export interface Session {
  user?: User;
}

export interface User {
  id: string;
}
