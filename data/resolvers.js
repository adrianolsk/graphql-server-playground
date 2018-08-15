"use strict";

const { User, pet } = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

const requiresRole = (role, resolver) => async (_, args, context, ...rest) => {
  if (context.user.roles.indexOf(role) < 0) {
    throw new Error("Not enought permissions to access this");
  }
  return await resolver(...[_, args, context, ...rest]);
};

const resolvers = {
  User: {
    pets: ({ id }, args, { petsLoader }) => {
      return petsLoader.load(id);
      // pet.findAll({
      //   where: {
      //     owner_id: id
      //   }
      // });
    }
  },
  Pet: {
    owner: ({ owner_id }, args, {}) =>
      User.findOne({
        where: {
          id: owner_id
        }
      })
  },
  Query: {
    // fetch the profile of currenly athenticated user
    me: requiresRole("admin", async (_, args, { user }) => {
      return await User.findById(user.id);
    }),
    async me2(_, args, { user }) {
      // Make sure user is logged in
      if (!user) {
        throw new Error("You are not authenticated!");
      }

      // user is authenticated´´
      return await User.findById(user.id);
    },
    usuarios: requiresRole("admin", async (_, args, { user }) => {
      let users = await User.findAll({ raw: true });
      return users;
    }),
    pets: requiresRole("admin", async (_, args, { user }) => {
      let users = await pet.findAll({
        //raw: true,
        // include: [
        //   {
        //     model: User,
        //     as: "owner"
        //   }
        // ]
      });
      return users;
    })
  },
  //test comment
  Mutation: {
    // Handle user signup
    async signup(_, { username, email, password }) {
      const user = await User.create({
        username,
        email,
        password: await bcrypt.hash(password, 10)
      });

      // Return json web token
      const token = jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );

      return { id: user.id, email: user.email };
    },

    // Handles user login
    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error("Incorrect password");
      }

      // Return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email, roles: ["admin"] },
        process.env.JWT_SECRET,
        { expiresIn: "1y" }
      );
    }
  }
};

module.exports = resolvers;
