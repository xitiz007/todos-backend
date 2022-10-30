const typeDefs = `#graphql
scalar Date
type Todo{
    id: ID
    title: String
    completed: Boolean
    createdAt: Date
    updatedAt:Date
}

type Response{
    success: Boolean
}

type Query {
    getTodos: [Todo]
}

type Mutation {
    createTodo(title: String!): Todo
    deleteTodo(id: String!): Response
    updateTodo(id: String!, title: String!, completed: Boolean!): Response
}

`;

export default typeDefs;
