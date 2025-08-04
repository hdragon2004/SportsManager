import { StatusCodes } from 'http-status-codes';
import {
  getAllRegistrations as getAllRegistrationsService,
  getRegistrationById,
  getRegistrationsByTournamentId,
  getRegistrationsByTeamId,
  createRegistration as createRegistrationService,
  updateRegistration as updateRegistrationService,
  deleteRegistration as deleteRegistrationService
} from '../services/registrationService';
import { socketManager } from '~/socket/socketManager';
import models from '~/models';

export async function getAllRegistrations(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả registrations
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const registrations = await getAllRegistrationsService();
      res.status(StatusCodes.OK).json({ success: true, data: registrations });
    } else {
      // User thường chỉ có thể xem registrations của teams mà họ sở hữu
      const userRegistrations = await models.Registration.findAll({
        include: [{
          model: models.Team,
          where: { User_ID: req.user.userId }
        }]
      });
      res.status(StatusCodes.OK).json({ success: true, data: userRegistrations });
    }
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching registrations',
      error: error.message
    });
  }
}

export async function getRegistration(req, res) {
  try {
    const registration = await getRegistrationById(req.params.id);
    
    if (!registration) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: registration });
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching registration',
      error: error.message
    });
  }
}

export async function getRegistrationsByTournament(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả registrations của tournament
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const registrations = await getRegistrationsByTournamentId(req.params.tournamentId);
      res.status(StatusCodes.OK).json({ success: true, data: registrations });
    } else {
      // User thường chỉ có thể xem registrations của tournament mà họ tham gia
      const userRegistration = await models.Registration.findOne({
        where: { Tournament_ID: req.params.tournamentId },
        include: [{
          model: models.Team,
          where: { User_ID: req.user.userId }
        }]
      });
      
      if (!userRegistration) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Bạn không có quyền xem registrations của tournament này'
        });
      }
      
      const registrations = await getRegistrationsByTournamentId(req.params.tournamentId);
      res.status(StatusCodes.OK).json({ success: true, data: registrations });
    }
  } catch (error) {
    console.error('Error fetching registrations by tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching registrations by tournament',
      error: error.message
    });
  }
}

export async function getRegistrationsByTeam(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì có thể xem registrations của bất kỳ team nào
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const registrations = await getRegistrationsByTeamId(req.params.teamId);
      res.status(StatusCodes.OK).json({ success: true, data: registrations });
    } else {
      // User thường chỉ có thể xem registrations của teams mà họ sở hữu
      const team = await models.Team.findOne({
        where: { 
          id: req.params.teamId,
          User_ID: req.user.userId
        }
      });
      
      if (!team) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Bạn không có quyền xem registrations của team này'
        });
      }
      
      const registrations = await getRegistrationsByTeamId(req.params.teamId);
      res.status(StatusCodes.OK).json({ success: true, data: registrations });
    }
  } catch (error) {
    console.error('Error fetching registrations by team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching registrations by team',
      error: error.message
    });
  }
}

export async function createRegistration(req, res) {
  try {
    // Kiểm tra deadline đăng ký
    const tournament = await models.Tournament.findByPk(req.body.Tournament_ID);
    
    if (!tournament) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Tournament not found'
      });
    }
    
    // Kiểm tra nếu có deadline và đã quá hạn
    if (tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Đã quá hạn đăng ký tham gia giải đấu. Hạn chót đăng ký là: ' + new Date(tournament.signup_deadline).toLocaleDateString('vi-VN')
      });
    }
    
    const registration = await createRegistrationService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: registration });
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating registration',
      error: error.message
    });
  }
}

export async function updateRegistration(req, res) {
  try {
    const updatedRegistration = await updateRegistrationService(req.params.id, req.body);
    
    if (!updatedRegistration) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    // If approval status is updated, send notification
    if (req.body.approval_status && updatedRegistration.Team_ID) {
      try {
        // Get team and tournament details for the notification
        const team = await models.Team.findByPk(updatedRegistration.Team_ID);
        const tournament = await models.Tournament.findByPk(updatedRegistration.Tournament_ID);
        
        if (team && tournament) {
          // Find team owner/captain to send notification
          const teamOwner = await models.User.findByPk(team.User_ID);
          
          if (teamOwner) {
            // Send socket notification about registration status
            await socketManager.sendRegistrationStatusNotification(
              teamOwner.id,
              updatedRegistration.Tournament_ID,
              updatedRegistration.Team_ID,
              req.body.approval_status,
              tournament.name,
              team.name
            );
          }
        }
      } catch (socketError) {
        console.error('Error sending socket notification for registration status:', socketError);
        // Continue with the response even if socket notification fails
      }
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedRegistration });
  } catch (error) {
    console.error('Error updating registration:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating registration',
      error: error.message
    });
  }
}

export async function deleteRegistration(req, res) {
  try {
    const deleted = await deleteRegistrationService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Registration not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting registration',
      error: error.message
    });
  }
} 