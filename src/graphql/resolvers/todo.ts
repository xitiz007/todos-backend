import { ApolloError } from "apollo-server-core";
import { GraphQLContext } from "../../util/types";
import { Todo } from "@prisma/client";
const todoResolvers = {
  Query: {
    getTodos: async (
      _: any,
      __: {},
      context: GraphQLContext
    ): Promise<Array<Todo>> => {
      const session = context.session;
      if (!session?.user) throw new ApolloError("UnAuthorized");
      const userId = session.user.id;
      const prisma = context.prisma;
      try {
        const todos = await prisma.todo.findMany({
          where: {
            userId,
          },
        });
        return todos;
      } catch (err: any) {
        throw new ApolloError(err?.message);
      }
    },
  },
  Mutation: {
    createTodo: async (
      _: any,
      args: { title: string },
      context: GraphQLContext
    ): Promise<Todo> => {
      const session = context.session;
      if (!session?.user) throw new ApolloError("UnAuthorized");
      const { title } = args;
      if (!title.trim()) throw new ApolloError("title cannot be empty");
      const userId = session.user.id;
      const prisma = context.prisma;
      try {
        const todo = await prisma.todo.create({
          data: {
            title: title.trim(),
            userId,
          },
        });
        return todo;
      } catch (err: any) {
        throw new ApolloError(err?.message);
      }
    },
    deleteTodo: async (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<{ success: boolean }> => {
      const { prisma, session } = context;
      if (!session?.user) throw new ApolloError("Unauthorized");
      const userId = session.user.id;
      const { id: todoId } = args;
      try {
        const { count } = await prisma.todo.deleteMany({
          where: {
            id: todoId,
            userId,
          },
        });
        const success = count !== 0;
        if (!success) throw new ApolloError("failed to delete todo");
        return { success };
      } catch (err: any) {
        throw new ApolloError(err?.message);
      }
    },
    updateTodo: async (
      _: any,
      args: { id: string; title: string; completed: boolean },
      context: GraphQLContext
    ): Promise<{ success: boolean }> => {
      const { session, prisma } = context;
      if (!session?.user) throw new ApolloError("UnAuthorized");
      const { id: todoId, title, completed } = args;
      const userId = session.user.id;
      if (!title.trim()) throw new ApolloError("title cannot be empty");
      try {
        const { count } = await prisma.todo.updateMany({
          where: { id: todoId, userId },
          data: { title: title.trim(), completed },
        });
        const success = count !== 0;
        if (!success) throw new ApolloError("failed to update todo");
        return { success };
      } catch (err: any) {
        throw new ApolloError(err?.message);
      }
    },
  },
};

export default todoResolvers;
