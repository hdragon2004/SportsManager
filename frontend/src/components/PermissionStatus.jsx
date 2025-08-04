import React, { useState, useEffect } from 'react';
import { getAllPermissions } from '../features/permissions/permissionAPI';

const PermissionStatus = ({ userId }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPermissions();
  }, [userId]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const response = await getAllPermissions();
      
      if (response.data.success) {
        // Lọc chỉ lấy yêu cầu của user hiện tại
        const userPermissions = response.data.data.filter(
          perm => perm.User_ID === userId
        );
        setPermissions(userPermissions);
      }
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'User';
      case 3:
        return 'Moderator';
      case 4:
        return 'Huấn luyện viên';
      default:
        return `Role ${roleId}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return null; // Không hiển thị gì nếu không có yêu cầu quyền
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trạng thái yêu cầu quyền</h3>
      
      <div className="space-y-4">
        {permissions.map((permission) => (
          <div key={permission.id} className="bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white">
                    Xin quyền {getRoleName(permission.Role_ID)}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Ngày gửi: {new Date(permission.requestDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(permission.status)}`}>
                {getStatusText(permission.status)}
              </span>
            </div>
            
            <div className="space-y-2">
              {permission.reason && (
                <div>
                  <span className="text-xs text-gray-400">Lý do:</span>
                  <p className="text-sm text-white">{permission.reason}</p>
                </div>
              )}
              
              {permission.note && (
                <div>
                  <span className="text-xs text-gray-400">
                    {permission.status === 'approved' ? 'Ghi chú duyệt:' : 'Lý do từ chối:'}
                  </span>
                  <p className="text-sm text-white">{permission.note}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-300">
          💡 Yêu cầu quyền sẽ được admin xem xét trong thời gian sớm nhất. 
          Bạn sẽ nhận được thông báo khi có kết quả.
        </p>
      </div>
    </div>
  );
};

export default PermissionStatus; 