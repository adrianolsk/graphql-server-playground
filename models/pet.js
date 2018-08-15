"use strict";
module.exports = (sequelize, DataTypes) => {
  var pet = sequelize.define(
    "pet",
    {
      owner_id: DataTypes.INTEGER,
      name: DataTypes.STRING
    },
    {
      underscored: true
    }
  );
  pet.associate = function(models) {
    pet.belongsTo(models.User, { as: "owner", foreignKey: "owner_id" });
    // associations can be defined here
  };
  return pet;
};
