// backend\src\services\teamService.js
import models from '~/models';

const getAllTeams = async () => {
  const teams = await models.Team.findAll({
    include: [{
      model: models.Team_Member
    }]
  });
  return teams;
};

const getTeamById = async (id) => {
  const team = await models.Team.findByPk(id, {
    include: [
      { 
        model: models.Team_Member
      }
    ]
  });
  return team;
};

const createTeam = async (teamData, userId) => {
  // Kết hợp dữ liệu từ form và User_ID từ token
  const newTeamData = {
    ...teamData,
    User_ID: userId
  };
  const team = await models.Team.create(newTeamData);
  return team;
};

const updateTeam = async (id, updateData) => {
  await models.Team.update(updateData, {
    where: { id },
  });
  return getTeamById(id);
};

const deleteTeam = async (id) => {
  const result = await models.Team.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};