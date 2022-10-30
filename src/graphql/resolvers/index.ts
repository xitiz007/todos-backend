import todoResolvers from "./todo";
import merge from "lodash.merge";

const resolvers = merge({}, todoResolvers);
export default resolvers;
