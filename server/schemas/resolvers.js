const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { book }, context) => {
      console.log("Adding new book", book, context.user._id);

      try {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          {
            new:true,
            runValidators:true
          }
        );

        // return await User.findById(context.user._id).populate("savedBooks");
      } catch (err) {
        console.error("Error creating book", err);
        return {};
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      console.log("Remove book", bookId, context.user._id);
      try {
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } }
        );
        return await User.findById(context.user._id).populate("savedBooks");
      } catch (err) {
        console.error("Error removing book", err);
        return {};
      }
    },
  },
};

module.exports = resolvers;
