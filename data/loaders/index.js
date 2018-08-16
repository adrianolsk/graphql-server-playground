const DataLoader = require("dataloader");
const models = require("../../models");
const batchPets = require("./batchPets");
const batchUsers = require("./batchUsers");

const createLoaders = () => {
  return {
    petsLoader: new DataLoader(keys => batchPets(keys, models)),
    usersLoader: new DataLoader(keys => batchUsers(keys, models))
  };
};

module.exports = createLoaders;
