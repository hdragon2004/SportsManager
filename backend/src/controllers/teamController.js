// backend\src\controllers\teamController.js
import { StatusCodes } from 'http-status-codes';
import {
  getAllTeams as getAllTeamsService,
  getTeamById,
  createTeam as createTeamService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService
} from '../services/teamService';
import models from '~/models';

export async function getAllTeams(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả teams
    const isAdmin = req.userRoles?.some(role => role.name === 'admin') || 
                   req.userData?.Roles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const teams = await getAllTeamsService();
      res.status(StatusCodes.OK).json({ success: true, data: teams });
    } else {
      // User thường chỉ có thể xem teams mà họ sở hữu
      const userTeams = await models.Team.findAll({
        where: { User_ID: req.user.userId },
        include: [{
          model: models.Team_Member
        }]
      });
      res.status(StatusCodes.OK).json({ success: true, data: userTeams });
    }
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching teams',
      error: error.message
    });
  }
}

export async function getTeam(req, res) {
  try {
    const team = await getTeamById(req.params.id);
    
    if (!team) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching team',
      error: error.message
    });
  }
}

export async function createTeam(req, res) {
  try {
    // Lấy userId từ req.user đã được gán bởi authMiddleware
    const userId = req.user.userId;
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng. Yêu cầu đăng nhập.'
      });
    }
    // Truyền cả req.body và userId vào service
    const team = await createTeamService(req.body, userId);
    res.status(StatusCodes.CREATED).json({ success: true, data: team });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating team',
      error: error.message
    });
  }
}

export async function updateTeam(req, res) {
  try {
    const updatedTeam = await updateTeamService(req.params.id, req.body);
    
    if (!updatedTeam) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating team',
      error: error.message
    });
  }
}

export async function deleteTeam(req, res) {
  try {
    const deleted = await deleteTeamService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Team not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting team',
      error: error.message
    });
  }
}

export async function addMemberToTeam(req, res) {
  try {
    const { teamId } = req.params;
    const { member_id } = req.body;

    if (!member_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'member_id là bắt buộc'
      });
    }

    // Kiểm tra xem đội có tồn tại không
    const team = await models.Team.findByPk(teamId);
    if (!team) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy đội'
      });
    }

    // Kiểm tra xem người dùng có tồn tại không
    const user = await models.User.findByPk(member_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    // Kiểm tra xem người dùng đã có trong đội chưa
    const existingMember = await models.Team_Member.findOne({
      where: {
        Team_ID: teamId,
        User_ID: member_id
      }
    });

    if (existingMember) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Người dùng đã có trong đội'
      });
    }

    // Thêm thành viên vào đội
    const teamMember = await models.Team_Member.create({
      Team_ID: teamId,
      User_ID: member_id
    });

    // Lấy thông tin chi tiết của thành viên vừa thêm
    const memberWithDetails = await models.Team_Member.findByPk(teamMember.id, {
      include: [{
        model: models.User,
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: memberWithDetails,
      message: 'Đã thêm thành viên vào đội thành công'
    });
  } catch (error) {
    console.error('Error adding member to team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Lỗi khi thêm thành viên vào đội',
      error: error.message
    });
  }
}

export async function removeMemberFromTeam(req, res) {
  try {
    const { teamId, memberId } = req.params;

    // Kiểm tra xem thành viên có tồn tại trong đội không
    const teamMember = await models.Team_Member.findOne({
      where: {
        id: memberId,
        Team_ID: teamId
      }
    });

    if (!teamMember) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy thành viên trong đội'
      });
    }

    // Xóa thành viên khỏi đội
    await teamMember.destroy();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Đã xóa thành viên khỏi đội thành công'
    });
  } catch (error) {
    console.error('Error removing member from team:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Lỗi khi xóa thành viên khỏi đội',
      error: error.message
    });
  }
}