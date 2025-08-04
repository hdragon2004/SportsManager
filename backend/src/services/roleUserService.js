import models from '~/models';

const getAllRoleUsers = async () => {
  const roleUsers = await models.Role_User.findAll({
    include: [
      { model: models.User },
      { model: models.Role }
    ]
  });
  return roleUsers;
};

const getRoleUserById = async (id) => {
  const roleUser = await models.Role_User.findByPk(id, {
    include: [
      { model: models.User },
      { model: models.Role }
    ]
  });
  return roleUser;
};

const createRoleUser = async (roleUserData) => {
  const roleUser = await models.Role_User.create(roleUserData);
  return roleUser;
};

const updateRoleUser = async (id, updateData) => {
  await models.Role_User.update(updateData, {
    where: { id },
  });
  return getRoleUserById(id);
};

const deleteRoleUser = async (id) => {
  const result = await models.Role_User.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllRoleUsers,
  getRoleUserById,
  createRoleUser,
  updateRoleUser,
  deleteRoleUser
}; 