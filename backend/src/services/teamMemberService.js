import models from '~/models';

const getAllTeamMembers = async () => {
  const teamMembers = await models.Team_Member.findAll({
    include: [
      { model: models.Team }
    ]
  });
  return teamMembers;
};

const getTeamMemberById = async (id) => {
  const teamMember = await models.Team_Member.findByPk(id, {
    include: [
      { model: models.Team }
    ]
  });
  return teamMember;
};

const createTeamMember = async (teamMemberData) => {
  const teamMember = await models.Team_Member.create(teamMemberData);
  return teamMember;
};

const updateTeamMember = async (id, updateData) => {
  await models.Team_Member.update(updateData, {
    where: { id },
  });
  return getTeamMemberById(id);
};

const deleteTeamMember = async (id) => {
  const result = await models.Team_Member.destroy({
    where: { id },
  });
  return result;
};

const getTeamMembersByTeamId = async (teamId) => {
  const teamMembers = await models.Team_Member.findAll({
    where: { Team_ID: teamId }
  });
  return teamMembers;
};

export {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMembersByTeamId
}; 