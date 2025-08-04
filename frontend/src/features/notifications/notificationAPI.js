import axiosInstance from '../../services/axiosClient';

// Lấy tất cả notifications
export const getAllNotifications = () => axiosInstance.get('/notifications');

// Lấy notification theo ID
export const getNotificationById = (id) => axiosInstance.get(`/notifications/${id}`);

// Tạo notification mới
export const createNotification = (data) => axiosInstance.post('/notifications', data);

// Cập nhật notification
export const updateNotification = (id, data) => axiosInstance.put(`/notifications/${id}`, data);

// Xóa notification
export const deleteNotification = (id) => axiosInstance.delete(`/notifications/${id}`);

// Đánh dấu notification đã đọc
export const markNotificationAsRead = (id) => axiosInstance.patch(`/notifications/${id}/read`);

// Đánh dấu tất cả notifications đã đọc
export const markAllNotificationsAsRead = () => axiosInstance.patch('/notifications/read-all');

// Lấy notifications chưa đọc
export const getUnreadNotifications = () => axiosInstance.get('/notifications/unread');

// Lấy notifications theo user
export const getNotificationsByUser = (userId) => axiosInstance.get(`/notifications?user_id=${userId}`);

// Gửi notification cho user
export const sendNotificationToUser = (userId, data) => axiosInstance.post(`/notifications/send/${userId}`, data);

// Lấy số thông báo chưa đọc của user
export const getUnreadCount = (userId) => axiosInstance.get(`/users/${userId}/notifications/unread-count`); 