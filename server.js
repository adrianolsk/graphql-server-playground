"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress } = require("apollo-server-express");
const schema = require("./data/schema");
const jwt = require("express-jwt");
const models = require("./models");
const createLoaders = require("./data/loaders");

require("dotenv").config();

const PORT = 3031;

// create our express app
const app = express();

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});

// graphql endpoint
app.use(
  "/api",
  bodyParser.json(),
  auth,
  graphqlExpress(req => ({
    schema,

    context: {
      user: req.user,
      models,
      ...createLoaders()
    },
    formatError(err) {
      //errors.report(err, req); // <-- log the error
      return {
        message: err.message,
        code: err.originalError && err.originalError.code, // <--
        locations: err.locations,
        path: err.path
      };
    }
  }))
);

app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}/api`);
});
