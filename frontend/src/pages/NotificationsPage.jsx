import React, { useState, useEffect } from 'react';
import NotificationList from '../features/notifications/NotificationList';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { notifications: socketNotifications, unreadCount } = useSocket();

  useEffect(() => {
    // Kiểm tra user đã đăng nhập chưa
    if (!user) {
      setError('Bạn cần đăng nhập để xem thông báo');
      setLoading(false);
      return;
    }

    // Khởi tạo trang
    setLoading(false);
  }, [user]);

  // Kiểm tra nếu user chưa đăng nhập
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Lỗi truy cập</p>
            <p>Bạn cần đăng nhập để xem thông báo</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thông báo của tôi</h1>
              <p className="text-sm text-gray-600 mt-1">
                Xin chào, {user.username || user.email || 'User'}! 
                {unreadCount > 0 && (
                  <span className="ml-2 text-blue-600 font-medium">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Danh sách thông báo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Danh sách thông báo</h2>
              <p className="text-sm text-gray-600 mt-1">
                Chỉ hiển thị thông báo dành cho bạn
              </p>
            </div>
            <NotificationList onStatsUpdate={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 