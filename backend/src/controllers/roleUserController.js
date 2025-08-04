import { StatusCodes } from 'http-status-codes';
import models from '../models';
import {
  getAllRoleUsers as getAllRoleUsersService,
  getRoleUserById,
  createRoleUser as createRoleUserService,
  updateRoleUser as updateRoleUserService,
  deleteRoleUser as deleteRoleUserService
} from '../services/roleUserService';

export async function getAllRoleUsers(req, res) {
  try {
    // Chỉ admin mới có thể xem tất cả role users
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem danh sách role users'
      });
    }
    
    const roleUsers = await getAllRoleUsersService();
    res.status(StatusCodes.OK).json({ success: true, data: roleUsers });
  } catch (error) {
    console.error('Error fetching role users:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching role users',
      error: error.message
    });
  }
}

export async function getRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể xem role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem role user'
      });
    }
    
    const roleUser = await getRoleUserById(req.params.id);
    
    if (!roleUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: roleUser });
  } catch (error) {
    console.error('Error fetching role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching role user',
      error: error.message
    });
  }
}

export async function createRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể tạo role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền tạo role user'
      });
    }
    
    const roleUser = await createRoleUserService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: roleUser });
  } catch (error) {
    console.error('Error creating role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating role user',
      error: error.message
    });
  }
}

export async function updateRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể cập nhật role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật role user'
      });
    }
    
    const updatedRoleUser = await updateRoleUserService(req.params.id, req.body);
    
    if (!updatedRoleUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedRoleUser });
  } catch (error) {
    console.error('Error updating role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating role user',
      error: error.message
    });
  }
}

export async function deleteRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể xóa role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa role user'
      });
    }
    
    const deleted = await deleteRoleUserService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting role user',
      error: error.message
    });
  }
}

// Function để user xin quyền huấn luyện viên
export async function requestCoachRole(req, res) {
  try {
    const userId = req.user.id;
    
    // Kiểm tra xem user đã có role coach chưa
    const isAlreadyCoach = req.userRoles?.some(role => role.name === 'coach' || role.name === 'huấn luyện viên');
    if (isAlreadyCoach) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Bạn đã có quyền huấn luyện viên'
      });
    }

    // Kiểm tra xem đã có request pending chưa
    const existingRequest = await models.Role_User.findOne({
      where: {
        User_ID: userId,
        Role_ID: 4, // Coach role
        status: 'pending'
      }
    });
    if (existingRequest) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Bạn đã có yêu cầu xin quyền huấn luyện viên đang chờ xử lý'
      });
    }

    // Tạo request xin quyền coach (status: pending)
    const roleUserData = {
      User_ID: userId,
      Role_ID: 4, // RoleId 4 là coach role
      status: 'pending',
      requestDate: new Date(),
      reason: req.body.reason || 'Xin quyền huấn luyện viên'
    };

    const roleUser = await createRoleUserService(roleUserData);
    
    res.status(StatusCodes.CREATED).json({ 
      success: true, 
      message: 'Yêu cầu xin quyền huấn luyện viên đã được gửi thành công',
      data: roleUser 
    });
  } catch (error) {
    console.error('Error requesting coach role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Có lỗi xảy ra khi gửi yêu cầu',
      error: error.message
    });
  }
} 