const { groupBy } = require("lodash");

const batchPets = async (keys, { pet, Op }) => {
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
  return keys.map(key => gs[key] || []);
};

module.exports = batchPets;
