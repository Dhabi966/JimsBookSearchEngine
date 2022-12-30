const apolloServerExpress = require("apollo-server-express");
const { User, Book } = require("../models");

const { signToken } = require("../utils/auth");

const { AuthenticationError } = apolloServerExpress;

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      // check if context contains a user
      if (context.user) {
        // find user by id and remove password and version fields from returned data
        const userData = await User.findOne({ _id: context.user._id }).select(
          "__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("You must be logged in");
    },
  },

  Mutation: {
    addUser: async (_parent, args) => {
      // create new user in the database
      const user = await User.create(args);
      console.log("generating token");
      // generate a token for the user
      const token = signToken(user);
      // return token and user data
      return {
        token,
        user,
      };
    },
    login: async (_parent, { email, password }) => {
      // find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Improper credentials, try again");
      }

      // check if provided password is correct
      const correctPassword = await user.isCorrectPassword(password);

      if (!correctPassword) {
        throw new AuthenticationError("Improper credentials, try again");
      }

      // generate a token for the user
      const token = signToken(user);
      // return token and user data
      return { token, user };
    },

    saveBook: async (_parent, { book }, context) => {
      // check if context contains a user
      if (context.user) {
        // find user by id and add book to savedBooks array
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        return user;
      }
      throw new AuthenticationError("You must be logged in");
    },
  },
};
module.exports = resolvers;
