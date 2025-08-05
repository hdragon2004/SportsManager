import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axiosClient from '../services/axiosClient';

const NotificationTest = () => {
  const { user, isAdmin, isCoach } = useAuth();
  const { markAsRead, markAllAsRead } = useSocket();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (testName, success, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      testName,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testMarkAsRead = async () => {
    try {
      setLoading(true);
      addTestResult('Mark as Read', 'running', 'Đang test...');
      
      // Lấy danh sách notifications trước
      const response = await axiosClient.get('/notifications');
      const notifications = response.data;
      
      if (notifications.length === 0) {
        addTestResult('Mark as Read', false, 'Không có thông báo nào để test');
        return;
      }
      
      // Test với notification đầu tiên
      const firstNotification = notifications[0];
      await markAsRead(firstNotification.id);
      
      addTestResult('Mark as Read', true, `Đã đánh dấu thông báo ${firstNotification.id} là đã đọc`);
    } catch (error) {
      console.error('Test mark as read error:', error);
      addTestResult('Mark as Read', false, `Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMarkAllAsRead = async () => {
    try {
      setLoading(true);
      addTestResult('Mark All as Read', 'running', 'Đang test...');
      
      await markAllAsRead();
      
      addTestResult('Mark All as Read', true, 'Đã đánh dấu tất cả thông báo là đã đọc');
    } catch (error) {
      console.error('Test mark all as read error:', error);
      addTestResult('Mark All as Read', false, `Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDeleteNotification = async () => {
    try {
      setLoading(true);
      addTestResult('Delete Notification', 'running', 'Đang test...');
      
      // Lấy danh sách notifications trước
      const response = await axiosClient.get('/notifications');
      const notifications = response.data;
      
      if (notifications.length === 0) {
        addTestResult('Delete Notification', false, 'Không có thông báo nào để test');
        return;
      }
      
      // Test với notification đầu tiên
      const firstNotification = notifications[0];
      const deleteResponse = await axiosClient.delete(`/notifications/${firstNotification.id}`);
      
      if (deleteResponse.data.success) {
        addTestResult('Delete Notification', true, `Đã xóa thông báo ${firstNotification.id}`);
      } else {
        addTestResult('Delete Notification', false, 'API trả về success: false');
      }
    } catch (error) {
      console.error('Test delete notification error:', error);
      addTestResult('Delete Notification', false, `Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetNotifications = async () => {
    try {
      setLoading(true);
      addTestResult('Get Notifications', 'running', 'Đang test...');
      
      const response = await axiosClient.get('/notifications');
      const notifications = response.data;
      
      addTestResult('Get Notifications', true, `Lấy được ${notifications.length} thông báo`);
    } catch (error) {
      console.error('Test get notifications error:', error);
      addTestResult('Get Notifications', false, `Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Test Notification Functions</h3>
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>User:</strong> {user?.username || 'Unknown'}</p>
          <p><strong>Role:</strong> {isAdmin ? 'Admin' : isCoach ? 'Coach' : 'Player'}</p>
          <p><strong>User ID:</strong> {user?.id || 'Unknown'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testGetNotifications}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Test Get Notifications
        </button>
        
        <button
          onClick={testMarkAsRead}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Test Mark as Read
        </button>
        
        <button
          onClick={testMarkAllAsRead}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          Test Mark All as Read
        </button>
        
        <button
          onClick={testDeleteNotification}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          Test Delete Notification
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium text-gray-900">Test Results</h4>
        <button
          onClick={clearResults}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Clear Results
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {testResults.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có kết quả test nào</p>
        ) : (
          testResults.map((result) => (
            <div
              key={result.id}
              className={`p-3 rounded-md border ${
                result.success === true
                  ? 'bg-green-50 border-green-200'
                  : result.success === false
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    result.success === true
                      ? 'text-green-800'
                      : result.success === false
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {result.testName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{result.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {result.success === true && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {result.success === false && (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {result.success === 'running' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                  )}
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationTest; 