import React, { useState, useEffect } from 'react';
import NotificationList from '../features/notifications/NotificationList';

const NotificationsPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    today: 0
  });

  useEffect(() => {
    // Tính toán thống kê từ notifications
    const calculateStats = () => {
      // Mock data - sẽ được thay thế bằng API call thực tế
      setStats({
        total: 24,
        unread: 8,
        today: 3
      });
    };

    calculateStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Thông báo</h1>
                <p className="text-blue-100 mt-1">Quản lý và theo dõi các thông báo từ hệ thống</p>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-blue-200 text-sm">Tổng cộng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{stats.unread}</div>
                  <div className="text-blue-200 text-sm">Chưa đọc</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{stats.today}</div>
                  <div className="text-blue-200 text-sm">Hôm nay</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Danh sách thông báo</h2>
            </div>
            <NotificationList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 