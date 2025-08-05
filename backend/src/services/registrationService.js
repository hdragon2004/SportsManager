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
  
  // Kiểm tra xem đội đã đăng ký giải đấu này chưa
  const existingRegistration = await models.Registration.findOne({
    where: {
      Tournament_ID: registrationData.Tournament_ID,
      Team_ID: registrationData.Team_ID,
      status: 'active' // Chỉ kiểm tra các đăng ký đang hoạt động
    }
  });
  
  if (existingRegistration) {
    throw new Error('Đội của bạn đã đăng ký tham gia giải đấu này. Không thể đăng ký lại.');
  }
  
  // Kiểm tra số lượng đăng ký hiện tại
  const currentRegistrations = await models.Registration.count({
    where: {
      Tournament_ID: registrationData.Tournament_ID,
      approval_status: ['pending', 'approved'] // Chỉ đếm các đăng ký đang chờ hoặc đã được chấp thuận
    }
  });
  
  // Kiểm tra nếu đã đủ số lượng đội tối đa
  if (tournament.max_teams && currentRegistrations >= tournament.max_teams) {
    throw new Error(`Giải đấu đã đủ số lượng đội tham gia (${tournament.max_teams} đội). Đăng ký đã được đóng.`);
  }
  
  // Set default values if not provided
  const registrationWithDefaults = {
    ...registrationData,
    time: registrationData.time || new Date(),
    approval_status: registrationData.approval_status || 'pending',
    status: registrationData.status || 'active'
  };
  const registration = await models.Registration.create(registrationWithDefaults);
  
  // Kiểm tra lại sau khi tạo đăng ký để xem có cần đóng đăng ký không
  const updatedRegistrations = await models.Registration.count({
    where: {
      Tournament_ID: registrationData.Tournament_ID,
      approval_status: ['pending', 'approved']
    }
  });
  
  // Nếu đã đủ số lượng đội, cập nhật deadline về thời gian hiện tại
  if (tournament.max_teams && updatedRegistrations >= tournament.max_teams) {
    await models.Tournament.update(
      { signup_deadline: new Date() },
      { where: { id: registrationData.Tournament_ID } }
    );
    
    console.log(`Tournament ${tournament.name} (ID: ${tournament.id}) đã đủ số lượng đội và đóng đăng ký tự động`);
  }
  
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