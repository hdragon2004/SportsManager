// backend\src\services\tournamentService.js
import models from '~/models';

const getAllTournaments = async () => {
  const tournaments = await models.Tournament.findAll({
    include: [{ model: models.Tournament_Type }]
  });
  return tournaments;
};

const getTournamentById = async (id) => {
  const tournament = await models.Tournament.findByPk(id, {
    include: [
      { model: models.Tournament_Type },
      { 
        model: models.Registration, 
        include: [{ model: models.Team }] 
      },
      {
        model: models.Match,
        include: [
          { 
            model: models.Team,
            through: models.Match_Team
          }
        ]
      }
    ]
  });
  return tournament;
};

const createTournament = async (tournamentData) => {
  const tournament = await models.Tournament.create(tournamentData);
  // Sau khi tạo mới, ta lấy lại đầy đủ thông tin để trả về
  return getTournamentById(tournament.id);
};

const updateTournament = async (id, updateData) => {
  // Tìm giải đấu cần cập nhật
  const tournament = await models.Tournament.findByPk(id);
  if (!tournament) {
    throw new Error('Tournament not found');
  }

  // Thực hiện cập nhật
  const [updatedRows] = await models.Tournament.update(updateData, {
    where: { id },
  });

  // Nếu cập nhật thành công, trả về đối tượng đã được cập nhật
  if (updatedRows > 0) {
    // Lấy lại đối tượng từ DB để đảm bảo dữ liệu là mới nhất
    const updatedTournament = await models.Tournament.findByPk(id, {
        include: [{ model: models.Tournament_Type }] // Include thông tin cần thiết
    });
    return updatedTournament;
  }
  
  // Nếu không có hàng nào được cập nhật, trả về null hoặc throw error
  return null;
};

const deleteTournament = async (id) => {
  const result = await models.Tournament.destroy({
    where: { id },
  });
  return result;
};

export {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament
};