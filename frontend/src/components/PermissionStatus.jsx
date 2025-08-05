import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const PermissionStatus = () => {
  const { user, isAdmin, isCoach } = useAuth();
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, [user]);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test các API endpoints khác nhau
      const tests = [
        { name: 'GET /notifications', method: 'get', url: '/notifications' },
        { name: 'PUT /notifications/:id/read', method: 'put', url: '/notifications/1/read' },
        { name: 'PUT /users/:id/notifications/read-all', method: 'put', url: `/users/${user?.id}/notifications/read-all` },
        { name: 'DELETE /notifications/:id', method: 'delete', url: '/notifications/1' },
      ];

      const results = {};

      for (const test of tests) {
        try {
          const response = await axiosClient[test.method](test.url);
          results[test.name] = {
            success: true,
            status: response.status,
            message: 'Thành công'
          };
        } catch (error) {
          results[test.name] = {
            success: false,
            status: error.response?.status,
            message: error.response?.data?.message || error.message
          };
        }
      }

      setPermissions(results);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (success) => {
    return success ? (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Permission Status</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>User ID:</strong> {user?.id || 'Unknown'}</p>
          <p><strong>Username:</strong> {user?.username || 'Unknown'}</p>
          <p><strong>Email:</strong> {user?.email || 'Unknown'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Is Coach:</strong> {isCoach ? 'Yes' : 'No'}</p>
          <p><strong>Roles:</strong> {user?.Roles?.map(role => role.name).join(', ') || 'None'}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900">API Permissions</h4>
          <button
            onClick={checkPermissions}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {Object.entries(permissions).map(([endpoint, result]) => (
          <div
            key={endpoint}
            className={`p-3 rounded-md border ${
              result.success
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${getStatusColor(result.success)}`}>
                  {endpoint}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Status: {result.status} - {result.message}
                </p>
              </div>
              {getStatusIcon(result.success)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Troubleshooting Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Nếu tất cả API calls đều thất bại, có thể do JWT token không hợp lệ</li>
          <li>• Nếu chỉ một số API calls thất bại, có thể do quyền không đủ</li>
          <li>• Kiểm tra console để xem chi tiết lỗi</li>
          <li>• Đảm bảo backend đang chạy và có thể kết nối</li>
        </ul>
      </div>
    </div>
  );
};

export default PermissionStatus; 