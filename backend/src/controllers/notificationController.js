import { StatusCodes } from 'http-status-codes';
import {
  getAllNotifications as getAllNotificationsService,
  getNotificationById,
  getNotificationsByUserId,
  getUnreadNotificationsCount,
  createNotification as createNotificationService,
  updateNotification as updateNotificationService,
  deleteNotification as deleteNotificationService,
  markAsRead,
  markAllAsRead
} from '../services/notificationService';
import models from '~/models';

export async function getAllNotifications(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả notifications
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const notifications = await getAllNotificationsService();
      res.status(StatusCodes.OK).json({ success: true, data: notifications });
    } else {
      // User thường chỉ có thể xem notifications của chính mình
      const userNotifications = await getNotificationsByUserId(req.user.userId);
      res.status(StatusCodes.OK).json({ success: true, data: userNotifications });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching notifications',
      error: error.message
    });
  }
}

export async function getNotification(req, res) {
  try {
    const notification = await getNotificationById(req.params.id);
    
    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error fetching notification:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching notification',
      error: error.message
    });
  }
}

export async function getUserNotifications(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì có thể xem notifications của bất kỳ user nào
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const notifications = await getNotificationsByUserId(req.params.userId);
      res.status(StatusCodes.OK).json({ success: true, data: notifications });
    } else {
      // User thường chỉ có thể xem notifications của chính mình
      if (parseInt(req.params.userId) !== req.user.userId) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Bạn không có quyền xem notifications của người khác'
        });
      }
      
      const notifications = await getNotificationsByUserId(req.params.userId);
      res.status(StatusCodes.OK).json({ success: true, data: notifications });
    }
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching user notifications',
      error: error.message
    });
  }
}

export async function getUnreadCount(req, res) {
  try {
    // Lấy thông tin user và roles nếu chưa có
    if (!req.userRoles) {
      const userWithRoles = await models.User.findByPk(req.user.userId, {
        include: [{
          model: models.Role,
          through: models.Role_User
        }]
      });
      req.userRoles = userWithRoles?.Roles || [];
    }

    // Kiểm tra nếu user có role admin thì có thể xem unread count của bất kỳ user nào
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const count = await getUnreadNotificationsCount(req.params.userId);
      res.status(StatusCodes.OK).json({ success: true, data: { count } });
    } else {
      // User thường chỉ có thể xem unread count của chính mình
      const targetUserIdInt = parseInt(req.params.userId);
      if (isNaN(targetUserIdInt) || targetUserIdInt !== req.user.userId) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: 'Bạn không có quyền xem unread count của người khác'
        });
      }
      
      const count = await getUnreadNotificationsCount(req.params.userId);
      res.status(StatusCodes.OK).json({ success: true, data: { count } });
    }
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching unread notifications count',
      error: error.message
    });
  }
}

export async function createNotification(req, res) {
  try {
    // Check if request body exists
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Request body is missing'
      });
    }
    
    // Check for required fields
    if (!req.body.title) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification title is required'
      });
    }
    
    if (!req.body.message) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Notification message is required'
      });
    }
    
    if (!req.body.User_ID) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User_ID is required'
      });
    }
    
    const notification = await createNotificationService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating notification',
      error: error.message
    });
  }
}

export async function updateNotification(req, res) {
  try {
    // Check if request body exists
    if (!req.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Request body is missing'
      });
    }
    
    const updatedNotification = await updateNotificationService(req.params.id, req.body);
    
    if (!updatedNotification) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating notification',
      error: error.message
    });
  }
}

export async function deleteNotification(req, res) {
  try {
    const deleted = await deleteNotificationService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting notification',
      error: error.message
    });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const notification = await markAsRead(req.params.id);
    
    if (!notification) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error marking notification as read',
      error: error.message
    });
  }
}

export async function markAllNotificationsAsRead(req, res) {
  try {
    await markAllAsRead(req.params.userId);
    res.status(StatusCodes.OK).json({ 
      success: true, 
      message: 'All notifications marked as read' 
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
} 