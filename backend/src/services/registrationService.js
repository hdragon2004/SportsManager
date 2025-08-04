import models from '~/models';

const getAllRegistrations = async () => {
  const registrations = await models.Registration.findAll({
    include: [
      { model: models.Tournament },
      { 
        model: models.Team,
        include: [
          { model: models.User },
          { model: models.Team_Member }
        ]
      }
    ]
  });
  return registrations;
};

const getRegistrationById = async (id) => {
  const registration = await models.Registration.findByPk(id, {
    include: [
      { model: models.Tournament },
      { model: models.Team }
    ]
  });
  return registration;
};

const getRegistrationsByTournamentId = async (tournamentId) => {
  const registrations = await models.Registration.findAll({
    where: { Tournament_ID: tournamentId },
    include: [
      { model: models.Team }
    ]
  });
  return registrations;
};

const getRegistrationsByTeamId = async (teamId) => {
  const registrations = await models.Registration.findAll({
    where: { Team_ID: teamId },
    include: [
      { model: models.Tournament }
    ]
  });
  return registrations;
};

const createRegistration = async (registrationData) => {
  // Kiểm tra deadline đăng ký
  const tournament = await models.Tournament.findByPk(registrationData.Tournament_ID);
  
  if (!tournament) {
    throw new Error('Tournament not found');
  }
  
  // Kiểm tra nếu có deadline và đã quá hạn
  if (tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline)) {
    throw new Error(`Đã quá hạn đăng ký tham gia giải đấu. Hạn chót đăng ký là: ${new Date(tournament.signup_deadline).toLocaleDateString('vi-VN')}`);
  }
  
  // Set default values if not provided
  const registrationWithDefaults = {
    ...registrationData,
    time: registrationData.time || new Date(),
    approval_status: registrationData.approval_status || 'pending',
    status: registrationData.status || 'active'
  };
  const registration = await models.Registration.create(registrationWithDefaults);
  return registration;
};

const updateRegistration = async (id, updateData) => {
  await models.Registration.update(updateData, {
    where: { id },
  });
  return getRegistrationById(id);
};

const deleteRegistration = async (id) => {
  const result = await models.Registration.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllRegistrations,
  getRegistrationById,
  getRegistrationsByTournamentId,
  getRegistrationsByTeamId,
  createRegistration,
  updateRegistration,
  deleteRegistration
}; 