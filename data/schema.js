"use strict";

const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./resolvers");

// Define our schema using the GraphQL schema language
const typeDefs = `
  type User {
    id: Int!
    username: String!
    email: String!
    pets: [Pet]
  }

  type Pet {
    id: Int!
    name: String!
    owner: User
  }

  type Query {
    me: User
    me2: User
    usuarios: [User]
    pets: [Pet]
  }

  type Mutation {
    signup (username: String!, email: String!, password: String!): User
    login (email: String!, password: String!): String
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
