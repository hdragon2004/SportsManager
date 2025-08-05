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
      // User thường có thể xem tất cả tournaments
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
    // Thêm thông tin user tạo tournament
    const tournamentData = {
      ...req.body,
      createdBy: req.user?.username || req.user?.email || 'Admin'
    };
    
    const tournament = await createTournamentService(tournamentData);
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

export async function getTournamentRegistrationStatus(req, res) {
  try {
    const tournament = await models.Tournament.findByPk(req.params.id, {
      include: [
        {
          model: models.Registration,
          where: {
            approval_status: ['pending', 'approved']
          },
          required: false
        }
      ]
    });
    
    if (!tournament) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tournament not found'
      });
    }
    
    const currentRegistrations = tournament.Registrations?.length || 0;
    const isRegistrationClosed = tournament.max_teams && currentRegistrations >= tournament.max_teams;
    const isDeadlinePassed = tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        maxTeams: tournament.max_teams,
        currentRegistrations,
        signupDeadline: tournament.signup_deadline,
        isRegistrationClosed,
        isDeadlinePassed,
        canRegister: !isRegistrationClosed && !isDeadlinePassed
      }
    });
  } catch (error) {
    console.error('Error fetching tournament registration status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching tournament registration status',
      error: error.message
    });
  }
} 

export async function getAllPublicTournaments(req, res) {
  try {
    // Lấy tất cả tournaments cho public view
    const allTournaments = await models.Tournament.findAll({
      include: [
        {
          model: models.Tournament_Type,
          as: 'Tournament_Type'
        },
        {
          model: models.Registration,
          include: [{ model: models.Team }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(StatusCodes.OK).json({ success: true, data: allTournaments });
  } catch (error) {
    console.error('Error fetching public tournaments:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournaments',
      error: error.message
    });
  }
}

export async function getPublicTournament(req, res) {
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
    console.error('Error fetching public tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournament',
      error: error.message
    });
  }
}

export async function getPublicTournamentRegistrationStatus(req, res) {
  try {
    const tournament = await models.Tournament.findByPk(req.params.id, {
      include: [
        {
          model: models.Registration,
          where: {
            approval_status: ['pending', 'approved']
          },
          required: false
        }
      ]
    });
    
    if (!tournament) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tournament not found'
      });
    }
    
    const currentRegistrations = tournament.Registrations?.length || 0;
    const isRegistrationClosed = tournament.max_teams && currentRegistrations >= tournament.max_teams;
    const isDeadlinePassed = tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline);
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        tournamentId: tournament.id,
        tournamentName: tournament.name,
        maxTeams: tournament.max_teams,
        currentRegistrations,
        signupDeadline: tournament.signup_deadline,
        isRegistrationClosed,
        isDeadlinePassed,
        canRegister: !isRegistrationClosed && !isDeadlinePassed
      }
    });
  } catch (error) {
    console.error('Error fetching public tournament registration status:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching tournament registration status',
      error: error.message
    });
  }
} 