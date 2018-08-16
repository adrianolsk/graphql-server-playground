const batchUsers = async (keys, { User, Op }) => {
  // keys = [1,2,3]
  const users = await User.findAll({
    raw: true,
    where: {
      id: {
        [Op.in]: keys
      }
    }
  });

  return keys.map(key => users.find(u => u.id === key));
};

module.exports = batchUsers;
