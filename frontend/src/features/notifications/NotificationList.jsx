import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../services/axiosClient';

const NotificationList = ({ onStatsUpdate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all,emis unread, read, tournament, team, schedule, warning
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get('/notifications');
        console.log('Notifications response:', response);
        console.log('Notifications data:', response.data);
        
        // Kiểm tra và lấy dữ liệu notifications
        let notificationsData = [];
        if (Array.isArray(response.data)) {
          notificationsData = response.data;
        } else if (response.data && Array.isArray(response.data.notifications)) {
          notificationsData = response.data.notifications;
        } else if (response.data && Array.isArray(response.data.data)) {
          notificationsData = response.data.data;
        } else {
          console.warn('Notifications data is not an array:', response.data);
          // Mock data cho demo
          notificationsData = [
            {
              id: 1,
              title: 'Đăng ký được chấp thuận',
              message: 'Đội của bạn "heo" đã được chấp thuận tham gia giải đấu: Giải bóng đá sinh viên TP.HCM 2025',
              type: 'success',
              category: 'registration',
              read: false,
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 phút trước
              priority: 'low'
            },
            {
              id: 2,
              title: 'Đăng ký bị từ chối',
              message: 'Đội của bạn "Đội cầu lông HCMUT" đã bị từ chối tham gia giải đấu: Giải bóng đá sinh viên TP.HCM 2025',
              type: 'error',
              category: 'registration',
              read: false,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 giờ trước
              priority: 'medium'
            },
            {
              id: 3,
              title: 'Đăng ký bị từ chối',
              message: 'Đội của bạn "heo" đã bị từ chối tham gia giải đấu: Giải bóng đá sinh viên TP.HCM 2025',
              type: 'error',
              category: 'registration',
              read: true,
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 ngày trước
              priority: 'low'
            },
            {
              id: 4,
              title: 'Đăng ký được chấp thuận',
              message: 'Đội của bạn "Đội cầu lông HCMUT" đã được chấp thuận tham gia giải đấu: Giải bóng đá 7 người mùa hè 2025',
              type: 'success',
              category: 'registration',
              read: false,
              timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 phút trước
              priority: 'low'
            }
          ];
        }
        
        console.log('Processed notifications data:', notificationsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Simulate WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001'); // Mock WebSocket URL
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications(prev => [newNotification, ...prev]);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'success':
        return 'Thành công';
      case 'warning':
        return 'Cảnh báo';
      case 'error':
        return 'Lỗi';
      case 'info':
        return 'Thông tin';
      default:
        return 'Thông báo';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19C3.65 20 3.2 19.6 3.1 19.1L1.1 9.1C1 8.5 1.5 8 2.1 8h3.8c.6 0 1.1.5 1 1.1L6.9 19H20V6H4.19z" />
          </svg>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'tournament':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'team':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'schedule':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19C3.65 20 3.2 19.6 3.1 19.1L1.1 9.1C1 8.5 1.5 8 2.1 8h3.8c.6 0 1.1.5 1 1.1L6.9 19H20V6H4.19z" />
          </svg>
        );
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'tournament':
        return 'Giải đấu';
      case 'team':
        return 'Đội thi đấu';
      case 'schedule':
        return 'Lịch thi đấu';
      case 'registration':
        return 'Đăng ký';
      case 'permission':
        return 'Phân quyền';
      default:
        return 'Thông báo';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Thấp';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const markAsRead = async (notificationId) => {
    try {
      // Hiển thị loading state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isUpdating: true }
            : notification
        )
      );

      // Gọi API để đánh dấu đã đọc
      const response = await axiosClient.put(`/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        // Cập nhật state local
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true, isUpdating: false }
              : notification
          )
        );
        
        // Hiển thị thông báo thành công
        setToast({ message: 'Đã đánh dấu thông báo là đã đọc!', type: 'success' });
        
        // Cập nhật thống kê nếu có callback
        if (onStatsUpdate) {
          onStatsUpdate();
        }
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Khôi phục trạng thái nếu có lỗi
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isUpdating: false }
            : notification
        )
      );
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = error.response?.data?.message || error.message;
      setToast({ 
        message: 'Có lỗi xảy ra khi đánh dấu đã đọc: ' + errorMessage, 
        type: 'error' 
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      // Hiển thị loading state cho tất cả notifications
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isUpdating: true }))
      );

      // Gọi API để đánh dấu tất cả đã đọc
      const response = await axiosClient.put('/notifications/read-all');
      
      if (response.data.success) {
        // Cập nhật state local
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true, isUpdating: false }))
        );
        
        // Hiển thị thông báo thành công
        setToast({ message: 'Đã đánh dấu tất cả thông báo là đã đọc!', type: 'success' });
        
        // Cập nhật thống kê nếu có callback
        if (onStatsUpdate) {
          onStatsUpdate();
        }
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      
      // Khôi phục trạng thái nếu có lỗi
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isUpdating: false }))
      );
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = error.response?.data?.message || error.message;
      setToast({ 
        message: 'Có lỗi xảy ra khi đánh dấu tất cả đã đọc: ' + errorMessage, 
        type: 'error' 
      });
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Xác nhận trước khi xóa
      if (!window.confirm('Bạn có chắc muốn xóa thông báo này?')) {
        return;
      }

      // Hiển thị loading state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isDeleting: true }
            : notification
        )
      );

      // Gọi API để xóa notification
      const response = await axiosClient.delete(`/notifications/${notificationId}`);
      
      if (response.data.success) {
        // Xóa khỏi state local
        setNotifications(prev =>
          prev.filter(notification => notification.id !== notificationId)
        );
        
        // Hiển thị thông báo thành công
        setToast({ message: 'Đã xóa thông báo thành công!', type: 'success' });
        
        // Cập nhật thống kê nếu có callback
        if (onStatsUpdate) {
          onStatsUpdate();
        }
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      
      // Khôi phục trạng thái nếu có lỗi
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isDeleting: false }
            : notification
        )
      );
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = error.response?.data?.message || error.message;
      setToast({ 
        message: 'Có lỗi xảy ra khi xóa thông báo: ' + errorMessage, 
        type: 'error' 
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Filter by read status
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    
    // Filter by category
    if (selectedCategory !== 'all' && notification.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const isUpdatingAll = notifications.some(n => n.isUpdating);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tải thông báo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="read">Đã đọc</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Loại:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả</option>
            <option value="tournament">Giải đấu</option>
            <option value="team">Đội thi đấu</option>
            <option value="schedule">Lịch thi đấu</option>
            <option value="registration">Đăng ký</option>
            <option value="permission">Phân quyền</option>
          </select>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={isUpdatingAll}
            className="ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdatingAll ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b border-blue-600 mr-2"></div>
                Đang xử lý...
              </span>
            ) : (
              'Đánh dấu tất cả đã đọc'
            )}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19C3.65 20 3.2 19.6 3.1 19.1L1.1 9.1C1 8.5 1.5 8 2.1 8h3.8c.6 0 1.1.5 1 1.1L6.9 19H20V6H4.19z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'unread' ? 'Bạn đã đọc tất cả thông báo' : 'Chưa có thông báo nào'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${getTypeColor(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                    {getTypeText(notification.type)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        {notification.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {getPriorityText(notification.priority)}
                          </span>
                        )}
                        {notification.category && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            {getCategoryIcon(notification.category)}
                            <span className="text-xs">{getCategoryText(notification.category)}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-3 pt-2 border-t border-gray-100">
                    {!notification.read && !notification.isUpdating && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={notification.isDeleting}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                    {notification.isUpdating && (
                      <span className="text-xs text-blue-600 font-medium flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                        Đang xử lý...
                      </span>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      disabled={notification.isUpdating || notification.isDeleting}
                      className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {notification.isDeleting ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                          Đang xóa...
                        </span>
                      ) : (
                        'Xóa'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default NotificationList; 