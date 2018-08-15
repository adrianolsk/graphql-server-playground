"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress } = require("apollo-server-express");
const schema = require("./data/schema");
const jwt = require("express-jwt");
const DataLoader = require("dataloader");
const { groupBy } = require("lodash");
const { pet, Op } = require("./models");
require("dotenv").config();

const PORT = 3031;

// create our express app
const app = express();

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
});

const batchPets = async keys => {
  // keys = [1,2,3]
  const pets = await pet.findAll({
    raw: true,
    where: {
      owner_id: {
        [Op.in]: keys
      }
    }
  });

  // keys => [{owner_id: 1}]
  const gs = groupBy(pets, "owner_id");
  return keys.map(k => gs[k] || []);
};
// graphql endpoint
app.use(
  "/api",
  bodyParser.json(),
  auth,
  graphqlExpress(req => ({
    schema,
    context: {
      user: req.user,
      petsLoader: new DataLoader(keys => batchPets(keys))
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
