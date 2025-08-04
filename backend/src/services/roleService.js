import models from '~/models';

const getAllRoles = async () => {
  const roles = await models.Role.findAll();
  return roles;
};

const getRoleById = async (id) => {
  const role = await models.Role.findByPk(id);
  return role;
};

const createRole = async (roleData) => {
  const role = await models.Role.create(roleData);
  return role;
};

const updateRole = async (id, updateData) => {
  await models.Role.update(updateData, {
    where: { id },
  });
  return getRoleById(id);
};

const deleteRole = async (id) => {
  const result = await models.Role.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
}; 