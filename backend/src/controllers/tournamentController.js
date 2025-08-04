import { StatusCodes } from 'http-status-codes';
import {
  getAllTournaments as getAllTournamentsService,
  getTournamentById,
  createTournament as createTournamentService,
  updateTournament as updateTournamentService,
  deleteTournament as deleteTournamentService
} from '../services/tournamentService';
import models from '~/models';
import { Op } from 'sequelize';

export async function getAllTournaments(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả tournaments
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const tournaments = await getAllTournamentsService();
      res.status(StatusCodes.OK).json({ success: true, data: tournaments });
    } else {
      // User thường có thể xem tất cả tournaments đang mở đăng ký
      // và tournaments mà họ đã đăng ký tham gia
      const now = new Date();
      
      // Lấy tất cả tournaments đang mở đăng ký
      const allTournaments = await models.Tournament.findAll({
        include: [
          {
            model: models.Tournament_Type,
            as: 'Tournament_Type'
          },
          {
            model: models.Registration,
            include: [{
              model: models.Team,
              where: { User_ID: req.user.userId }
            }]
          }
        ],
        where: {
          // Chỉ lấy tournaments đang mở đăng ký hoặc đang diễn ra
          [Op.or]: [
            {
              signup_deadline: {
                [Op.gt]: now
              }
            },
            {
              status: 'active'
            },
            {
              status: 'upcoming'
            }
          ]
        },
        order: [['createdAt', 'DESC']]
      });
      
      res.status(StatusCodes.OK).json({ success: true, data: allTournaments });
    }
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournaments',
      error: error.message
    });
  }
}

export async function getTournament(req, res) {
  try {
    const tournament = await getTournamentById(req.params.id);
    
    if (!tournament) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }

    // Tính toán thống kê
    const stats = {
      totalTeams: tournament.Registrations ? tournament.Registrations.length : 0,
      totalMatches: tournament.Matches ? tournament.Matches.length : 0,
      completedMatches: tournament.Matches ? tournament.Matches.filter(match => match.status === 'completed').length : 0,
      upcomingMatches: tournament.Matches ? tournament.Matches.filter(match => match.status === 'scheduled').length : 0,
      ongoingMatches: tournament.Matches ? tournament.Matches.filter(match => match.status === 'ongoing').length : 0
    };
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      data: tournament,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournament',
      error: error.message
    });
  }
}

export async function createTournament(req, res) {
  try {
    const tournament = await createTournamentService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: tournament });
  } catch (error) {
    console.error('Error creating tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating tournament',
      error: error.message
    });
  }
}

export async function updateTournament(req, res) {
  try {
    const updatedTournament = await updateTournamentService(req.params.id, req.body);
    
    if (!updatedTournament) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedTournament });
  } catch (error) {
    console.error('Error updating tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating tournament',
      error: error.message
    });
  }
}

export async function deleteTournament(req, res) {
  try {
    const deleted = await deleteTournamentService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting tournament',
      error: error.message
    });
  }
} 