import { StatusCodes } from 'http-status-codes';
import {
  getAllMatches as getAllMatchesService,
  getMatchById,
  getMatchesByTournamentId,
  createMatch as createMatchService,
  updateMatch as updateMatchService,
  deleteMatch as deleteMatchService
} from '../services/matchService';
import { socketManager } from '~/socket/socketManager';
import models from '~/models';

export async function getAllMatches(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả matches
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const matches = await getAllMatchesService();
      res.status(StatusCodes.OK).json({ success: true, data: matches });
    } else {
      // User thường chỉ có thể xem matches của tournaments mà họ tham gia
      const userMatches = await models.Match.findAll({
        include: [{
          model: models.Tournament,
          include: [{
            model: models.Registration,
            include: [{
              model: models.Team,
              where: { User_ID: req.user.userId }
            }]
          }]
        }]
      });
      
      // Lọc ra các matches có registration của user
      const filteredMatches = userMatches.filter(match => 
        match.Tournament.Registrations.length > 0
      );
      
      res.status(StatusCodes.OK).json({ success: true, data: filteredMatches });
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching matches',
      error: error.message
    });
  }
}

export async function getMatch(req, res) {
  try {
    const match = await getMatchById(req.params.id);
    
    if (!match) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: match });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching match',
      error: error.message
    });
  }
}

export async function getMatchesByTournament(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả matches của tournament
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const matches = await getMatchesByTournamentId(req.params.tournamentId);
      res.status(StatusCodes.OK).json({ success: true, data: matches });
    } else {
      // User thường chỉ có thể xem matches của tournament mà họ tham gia
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
          message: 'Bạn không có quyền xem matches của tournament này'
        });
      }
      
      const matches = await getMatchesByTournamentId(req.params.tournamentId);
      res.status(StatusCodes.OK).json({ success: true, data: matches });
    }
  } catch (error) {
    console.error('Error fetching matches by tournament:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching matches by tournament',
      error: error.message
    });
  }
}



export async function createMatch(req, res) {
  try {
    const match = await createMatchService(req.body);
    
    // Send real-time notification for new match schedule
    if (match && match.Tournament_ID) {
      try {
        // Get tournament name for the notification
        const tournamentName = match.Tournament ? match.Tournament.name : 'tournament';
        
        // Prepare match data for notification
        const matchData = {
          matchId: match.id,
          tournamentId: match.Tournament_ID,
          tournamentName,
          matchDate: match.match_date,
          location: match.location,
          status: match.status
        };
        
        // Send socket notification
        await socketManager.sendNewScheduleNotification(
          match.Tournament_ID,
          match.id,
          matchData
        );
      } catch (socketError) {
        console.error('Error sending socket notification for new match:', socketError);
        // Continue with the response even if socket notification fails
      }
    }
    
    res.status(StatusCodes.CREATED).json({ success: true, data: match });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating match',
      error: error.message
    });
  }
}

export async function updateMatch(req, res) {
  try {
    const updatedMatch = await updateMatchService(req.params.id, req.body);
    
    if (!updatedMatch) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    // If status is updated to 'completed' or result is updated, send result notification
    if (req.body.status === 'completed' || req.body.result) {
      try {
        // Get tournament name for the notification
        const tournamentName = updatedMatch.Tournament ? updatedMatch.Tournament.name : 'tournament';
        
        // Prepare match data for notification
        const matchData = {
          matchId: updatedMatch.id,
          tournamentId: updatedMatch.Tournament_ID,
          tournamentName,
          matchDate: updatedMatch.match_date,
          location: updatedMatch.location,
          status: updatedMatch.status,
          result: updatedMatch.result
        };
        
        // Send socket notification
        await socketManager.sendMatchResultNotification(
          updatedMatch.Tournament_ID,
          updatedMatch.id,
          matchData
        );
      } catch (socketError) {
        console.error('Error sending socket notification for match result:', socketError);
        // Continue with the response even if socket notification fails
      }
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedMatch });
  } catch (error) {
    console.error('Error updating match:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating match',
      error: error.message
    });
  }
}

export async function deleteMatch(req, res) {
  try {
    const deleted = await deleteMatchService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Match not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting match',
      error: error.message
    });
  }
} 