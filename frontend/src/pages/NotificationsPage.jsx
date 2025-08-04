import React, { useState, useEffect } from 'react';
import NotificationList from '../features/notifications/NotificationList';
import { getAllNotifications, getUnreadNotifications } from '../features/notifications/notificationAPI';
import { useAuth } from '../contexts/AuthContext';

const NotificationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Khởi tạo trang
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Danh sách thông báo */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Danh sách thông báo</h2>
            </div>
            <NotificationList onStatsUpdate={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 