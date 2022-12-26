const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String!
  password: String!
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  bookId: ID!
  title: String!
  authors: [String]
  description: String
  image: String
  link: String
}

type Query {
  me: User
  getSingleUser(id: ID, username: String): User
}

type Mutation {
  login(username: String, email: String!, password: String!): Auth
  saveBook(book: Book): User
  removeBook(bookId: ID!): User
}

type Auth {
  token: String
  user: User
}
`;

module.exports = typeDefs;
