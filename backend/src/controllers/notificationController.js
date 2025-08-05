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
import tournamentNotificationService from '../services/tournamentNotificationService';

// Lấy tất cả thông báo của user đang đăng nhập
const getAllNotificationsController = async (req, res) => {
  try {
    // Kiểm tra user đã đăng nhập chưa
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Bạn cần đăng nhập để xem thông báo'
      });
    }

    // Lấy thông báo của user đang đăng nhập
    const notifications = await getNotificationsByUserId(req.user.userId);
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error in getAllNotificationsController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách thông báo',
      error: error.message
    });
  }
};

// Lấy thông báo theo ID
const getNotificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await getNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error in getNotificationByIdController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông báo',
      error: error.message
    });
  }
};

// Lấy thông báo theo user ID
const getNotificationsByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await getNotificationsByUserId(userId);
    
    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    console.error('Error in getNotificationsByUserIdController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông báo của user',
      error: error.message
    });
  }
};

// Lấy số lượng thông báo chưa đọc
const getUnreadNotificationsCountController = async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await getUnreadNotificationsCount(userId);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error in getUnreadNotificationsCountController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy số lượng thông báo chưa đọc',
      error: error.message
    });
  }
};

// Tạo thông báo mới
const createNotificationController = async (req, res) => {
  try {
    const notificationData = req.body;
    const notification = await createNotificationService(notificationData);
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error in createNotificationController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo thông báo',
      error: error.message
    });
  }
};

// Cập nhật thông báo
const updateNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const notification = await updateNotificationService(id, updateData);
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error in updateNotificationController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật thông báo',
      error: error.message
    });
  }
};

// Xóa thông báo
const deleteNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNotificationService(id);
    
    res.json({
      success: true,
      message: 'Đã xóa thông báo thành công'
    });
  } catch (error) {
    console.error('Error in deleteNotificationController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa thông báo',
      error: error.message
    });
  }
};

// Đánh dấu thông báo đã đọc
const markAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markAsRead(id);
    
    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error in markAsReadController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu thông báo đã đọc',
      error: error.message
    });
  }
};

// Đánh dấu tất cả thông báo đã đọc
const markAllAsReadController = async (req, res) => {
  try {
    const { userId } = req.params;
    await markAllAsRead(userId);
    
    res.json({
      success: true,
      message: 'Đã đánh dấu tất cả thông báo đã đọc'
    });
  } catch (error) {
    console.error('Error in markAllAsReadController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đánh dấu tất cả thông báo đã đọc',
      error: error.message
    });
  }
};

// Gửi thông báo tự động cho các giải đấu hôm nay
const sendTodayTournamentsNotificationController = async (req, res) => {
  try {
    const result = await tournamentNotificationService.sendTodayTournamentsNotification();
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in sendTodayTournamentsNotificationController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi thông báo tự động',
      error: error.message
    });
  }
};

// Gửi thông báo nhắc nhở trận đấu
const sendMatchReminderNotificationController = async (req, res) => {
  try {
    const { minutesBefore = 30 } = req.body;
    const result = await tournamentNotificationService.sendMatchReminderNotification(minutesBefore);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in sendMatchReminderNotificationController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi thông báo nhắc nhở',
      error: error.message
    });
  }
};

// Khởi động lịch trình gửi thông báo tự động
const startNotificationScheduleController = async (req, res) => {
  try {
    tournamentNotificationService.scheduleNotifications();
    
    res.json({
      success: true,
      message: 'Đã khởi động lịch trình gửi thông báo tự động'
    });
  } catch (error) {
    console.error('Error in startNotificationScheduleController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi khởi động lịch trình thông báo',
      error: error.message
    });
  }
};

// Lấy thông tin các trận đấu hôm nay
const getTodayMatchesController = async (req, res) => {
  try {
    const matches = await tournamentNotificationService.getTodayMatches();
    
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error in getTodayMatchesController:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin trận đấu hôm nay',
      error: error.message
    });
  }
};

export {
  getAllNotificationsController,
  getNotificationByIdController,
  getNotificationsByUserIdController,
  getUnreadNotificationsCountController,
  createNotificationController,
  updateNotificationController,
  deleteNotificationController,
  markAsReadController,
  markAllAsReadController,
  sendTodayTournamentsNotificationController,
  sendMatchReminderNotificationController,
  startNotificationScheduleController,
  getTodayMatchesController
}; 