import models from '~/models'; // models/index.js phải export tất cả models
import { Op } from 'sequelize';

const createUser = async (userData) => {
  // Set default values for new fields if not provided
  const userWithDefaults = {
    ...userData,
    isActive: userData.isActive !== undefined ? userData.isActive : true
  };
  const user = await models.User.create(userWithDefaults);
  return user;
};

const getUsers = async () => {
  const users = await models.User.findAll();
  return users;
};

const getUserById = async (id) => {
  const user = await models.User.findByPk(id);
  return user;
};

const updateUser = async (id, updateData) => {
  await models.User.update(updateData, {
    where: { id },
  });
  return getUserById(id);
};

const deleteUser = async (id) => {
  const result = await models.User.destroy({
    where: { id },
  });
  return result;
};

const searchUsers = async (query) => {
  const users = await models.User.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${query}%`
          }
        },
        {
          email: {
            [Op.like]: `%${query}%`
          }
        }
      ]
    },
    attributes: ['id', 'name', 'email', 'isActive'],
    limit: 10
  });
  return users;
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers
};
