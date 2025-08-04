import models from '~/models';

const getAllTournamentTypes = async () => {
  const tournamentTypes = await models.Tournament_Type.findAll();
  return tournamentTypes;
};

const getTournamentTypeById = async (id) => {
  const tournamentType = await models.Tournament_Type.findByPk(id, {
    include: [{ model: models.Tournament }]
  });
  return tournamentType;
};

const createTournamentType = async (tournamentTypeData) => {
  const tournamentType = await models.Tournament_Type.create(tournamentTypeData);
  return tournamentType;
};

const updateTournamentType = async (id, updateData) => {
  await models.Tournament_Type.update(updateData, {
    where: { id },
  });
  return getTournamentTypeById(id);
};

const deleteTournamentType = async (id) => {
  const result = await models.Tournament_Type.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllTournamentTypes,
  getTournamentTypeById,
  createTournamentType,
  updateTournamentType,
  deleteTournamentType
}; 