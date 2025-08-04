import React, { useState, useEffect } from 'react';
import { getNotificationStatsByType, getNotificationStatsByTime } from '../features/notifications/notificationStatsAPI';

const NotificationStats = ({ stats, loading }) => {
  const [typeStats, setTypeStats] = useState({});
  const [timeStats, setTimeStats] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (showDetails) {
      fetchDetailedStats();
    }
  }, [showDetails]);

  const fetchDetailedStats = async () => {
    try {
      // Lấy thống kê theo loại
      const typeResponse = await getNotificationStatsByType();
      if (typeResponse.data.success) {
        setTypeStats(typeResponse.data.data);
      }

      // Lấy thống kê theo thời gian
      const timeResponse = await getNotificationStatsByTime('week');
      if (timeResponse.data.success) {
        setTimeStats(timeResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Thống kê thông báo</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>
      </div>

      {/* Thống kê cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng cộng</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Chưa đọc</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Hôm nay</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê chi tiết */}
      {showDetails && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thống kê theo loại */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Theo loại thông báo</h4>
              <div className="space-y-2">
                {Object.entries(typeStats).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getTypeColor(type)}`}>
                        {getTypeIcon(type)}
                      </div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
                {Object.keys(typeStats).length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>
            </div>

            {/* Thống kê theo thời gian */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Theo thời gian</h4>
              <div className="space-y-2">
                {Object.entries(timeStats).map(([period, count]) => (
                  <div key={period} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700 capitalize">{period}</span>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
                {Object.keys(timeStats).length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationStats; 