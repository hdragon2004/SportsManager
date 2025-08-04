import axiosClient from '../../services/axiosClient';

// Lấy thống kê notifications
export const getNotificationStats = async () => {
  try {
    const response = await axiosClient.get('/notifications/stats');
    return response;
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    throw error;
  }
};

// Lấy số lượng notifications chưa đọc
export const getUnreadCount = async () => {
  try {
    const response = await axiosClient.get('/notifications/unread-count');
    return response;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Lấy số lượng notifications hôm nay
export const getTodayCount = async () => {
  try {
    const response = await axiosClient.get('/notifications/today-count');
    return response;
  } catch (error) {
    console.error('Error fetching today count:', error);
    throw error;
  }
};

// Lấy thống kê theo user
export const getUserNotificationStats = async (userId) => {
  try {
    const response = await axiosClient.get(`/users/${userId}/notifications/stats`);
    return response;
  } catch (error) {
    console.error('Error fetching user notification stats:', error);
    throw error;
  }
};

// Lấy thống kê theo loại notification
export const getNotificationStatsByType = async () => {
  try {
    const response = await axiosClient.get('/notifications/stats/by-type');
    return response;
  } catch (error) {
    console.error('Error fetching notification stats by type:', error);
    throw error;
  }
};

// Lấy thống kê theo thời gian (tuần, tháng, năm)
export const getNotificationStatsByTime = async (period = 'week') => {
  try {
    const response = await axiosClient.get(`/notifications/stats/by-time?period=${period}`);
    return response;
  } catch (error) {
    console.error('Error fetching notification stats by time:', error);
    throw error;
  }
}; 