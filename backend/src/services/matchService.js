import models from '~/models';

const getAllMatches = async () => {
  const matches = await models.Match.findAll({
    include: [
      { model: models.Tournament },
      { 
        model: models.Team,
        through: models.Match_Team
      }
    ]
  });
  return matches;
};

const getMatchById = async (id) => {
  const match = await models.Match.findByPk(id, {
    include: [
      { model: models.Tournament },
      { 
        model: models.Team,
        through: models.Match_Team
      }
    ]
  });
  return match;
};

const getMatchesByTournamentId = async (tournamentId) => {
  const matches = await models.Match.findAll({
    where: { Tournament_ID: tournamentId },
    include: [
      { 
        model: models.Team,
        through: models.Match_Team
      }
    ]
  });
  return matches;
};



const createMatch = async (matchData) => {
  const match = await models.Match.create(matchData);
  return match;
};

const updateMatch = async (id, updateData) => {
  await models.Match.update(updateData, {
    where: { id },
  });
  return getMatchById(id);
};

const deleteMatch = async (id) => {
  const result = await models.Match.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllMatches,
  getMatchById,
  getMatchesByTournamentId,
  createMatch,
  updateMatch,
  deleteMatch
}; 