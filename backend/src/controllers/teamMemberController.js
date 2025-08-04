import { StatusCodes } from 'http-status-codes';
import {
  getAllTeamMembers as getAllTeamMembersService,
  getTeamMemberById,
  createTeamMember as createTeamMemberService,
  updateTeamMember as updateTeamMemberService,
  deleteTeamMember as deleteTeamMemberService,
  getTeamMembersByTeamId
} from '~/services/teamMemberService';
import models from '~/models';

export async function getAllTeamMembers(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả team members
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const teamMembers = await getAllTeamMembersService();
      res.status(StatusCodes.OK).json({ success: true, data: teamMembers });
    } else {
      // User thường chỉ có thể xem team members của teams mà họ sở hữu
      const userTeamMembers = await models.Team_Member.findAll({
        include: [{
          model: models.Team,
          where: { User_ID: req.user.userId }
        }]
      });
      res.status(StatusCodes.OK).json({ success: true, data: userTeamMembers });
    }
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching team members',
      error: error.message
    });
  }
}

export async function getTeamMember(req, res) {
  try {
    const teamMember = await getTeamMemberById(req.params.id);
    
    if (!teamMember) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team member not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching team member',
      error: error.message
    });
  }
}

export async function createTeamMember(req, res) {
  try {
    const teamMember = await createTeamMemberService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: teamMember });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating team member',
      error: error.message
    });
  }
}

export async function updateTeamMember(req, res) {
  try {
    const updatedTeamMember = await updateTeamMemberService(req.params.id, req.body);
    
    if (!updatedTeamMember) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team member not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedTeamMember });
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating team member',
      error: error.message
    });
  }
}

export async function deleteTeamMember(req, res) {
  try {
    const deleted = await deleteTeamMemberService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team member not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting team member',
      error: error.message
    });
  }
}

// Get team members by team ID
export async function getTeamMembersByTeam(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì có thể xem team members của bất kỳ team nào
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const teamMembers = await getTeamMembersByTeamId(req.params.teamId);
      res.status(StatusCodes.OK).json({ success: true, data: teamMembers });
    } else {
      // User thường chỉ có thể xem team members của teams mà họ sở hữu
      const team = await models.Team.findOne({
        where: { 
          id: req.params.teamId,
          User_ID: req.user.userId
        }
      });
      
      if (!team) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Bạn không có quyền xem team members của team này'
        });
      }
      
      const teamMembers = await getTeamMembersByTeamId(req.params.teamId);
      res.status(StatusCodes.OK).json({ success: true, data: teamMembers });
    }
  } catch (error) {
    console.error('Error fetching team members by team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching team members by team',
      error: error.message
    });
  }
} 