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
    console.log('Requesting coach role for user:', userId);
    console.log('User roles:', req.userRoles);
    
    // Kiểm tra xem user đã có role coach chưa
    const isAlreadyCoach = req.userRoles?.some(role => role.name === 'coach');
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

    console.log('Creating role user with data:', roleUserData);
    const roleUser = await createRoleUserService(roleUserData);
    console.log('Role user created:', roleUser);
    
    // Tạo notification cho user
    try {
      await models.Notification.create({
        User_ID: userId,
        title: 'Yêu cầu quyền huấn luyện viên đã được gửi',
        message: 'Yêu cầu xin quyền huấn luyện viên của bạn đã được gửi thành công. Admin sẽ xem xét và phản hồi trong thời gian sớm nhất.',
        type: 'permission_requested',
        isRead: false
      });
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
    }
    
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

// Function để admin xử lý yêu cầu xin quyền huấn luyện viên
export async function processCoachRoleRequest(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    
    // Kiểm tra quyền admin
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xử lý yêu cầu'
      });
    }

    // Tìm permission request
    const permissionRequest = await models.Role_User.findOne({
      where: { id },
      include: [
        { model: models.User },
        { model: models.Role }
      ]
    });

    if (!permissionRequest) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Không tìm thấy yêu cầu'
      });
    }

    // Kiểm tra xem đây có phải là yêu cầu coach role không
    if (permissionRequest.Role_ID !== 4) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Chỉ có thể xử lý yêu cầu quyền huấn luyện viên'
      });
    }

    // Kiểm tra trạng thái hiện tại
    if (permissionRequest.status !== 'pending') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Yêu cầu này đã được xử lý'
      });
    }

    // Cập nhật trạng thái
    const updateData = {
      status,
      note: adminNote
    };

    const updatedPermission = await updateRoleUserService(id, updateData);

    // Nếu được duyệt, tạo notification cho user
    if (status === 'approved') {
      try {
        await models.Notification.create({
          User_ID: permissionRequest.User_ID,
          title: 'Yêu cầu quyền huấn luyện viên đã được duyệt',
          message: 'Yêu cầu xin quyền huấn luyện viên của bạn đã được admin duyệt. Bây giờ bạn có thể sử dụng các tính năng của huấn luyện viên.',
          type: 'permission_approved',
          isRead: false
        });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    } else if (status === 'rejected') {
      try {
        await models.Notification.create({
          User_ID: permissionRequest.User_ID,
          title: 'Yêu cầu quyền huấn luyện viên bị từ chối',
          message: `Yêu cầu xin quyền huấn luyện viên của bạn đã bị từ chối. Lý do: ${adminNote || 'Không có lý do cụ thể'}`,
          type: 'permission_rejected',
          isRead: false
        });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Yêu cầu đã được ${status === 'approved' ? 'duyệt' : 'từ chối'} thành công`,
      data: updatedPermission
    });
  } catch (error) {
    console.error('Error processing coach role request:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Có lỗi xảy ra khi xử lý yêu cầu',
      error: error.message
    });
  }
}

// Function để lấy danh sách yêu cầu xin quyền coach
export async function getCoachRoleRequests(req, res) {
  try {
    // Chỉ admin mới có thể xem danh sách yêu cầu
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem danh sách yêu cầu'
      });
    }

    const coachRequests = await models.Role_User.findAll({
      where: {
        Role_ID: 4 // Coach role
      },
      include: [
        { model: models.User },
        { model: models.Role }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: coachRequests
    });
  } catch (error) {
    console.error('Error fetching coach role requests:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách yêu cầu',
      error: error.message
    });
  }
} 