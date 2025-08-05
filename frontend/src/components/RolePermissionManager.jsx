import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const RolePermissionManager = () => {
  const { user, isAdmin } = useAuth();
  const { socket, isConnected } = useSocket();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchUsersAndRoles();
  }, []);

  // Listen for realtime role updates
  useEffect(() => {
    if (!socket) return;

    socket.on('userRoleUpdate', (data) => {
      console.log('User role update received:', data);
      updateUserRole(data);
    });

    socket.on('permissionChange', (data) => {
      console.log('Permission change received:', data);
      updatePermissions(data);
    });

    return () => {
      socket.off('userRoleUpdate');
      socket.off('permissionChange');
    };
  }, [socket]);

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await axiosClient.get('/users');
      setUsers(usersResponse.data || []);
      
      // Fetch roles
      const rolesResponse = await axiosClient.get('/roles');
      setRoles(rolesResponse.data || []);
    } catch (error) {
      console.error('Error fetching users and roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = (data) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === data.userId 
          ? { ...user, role: data.role, updated_at: new Date() }
          : user
      )
    );
  };

  const updatePermissions = (data) => {
    setRoles(prev => 
      prev.map(role => 
        role.id === data.roleId 
          ? { ...role, permissions: data.permissions, updated_at: new Date() }
          : role
      )
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin) {
      alert('Bạn không có quyền thay đổi vai trò người dùng');
      return;
    }

    try {
      const response = await axiosClient.put(`/users/${userId}/role`, {
        role: newRole
      });

      if (response.data.success) {
        // Emit to socket for realtime update
        if (socket) {
          socket.emit('userRoleUpdate', {
            userId,
            role: newRole,
            updatedBy: user.id
          });
        }

        alert('Cập nhật vai trò thành công!');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Có lỗi xảy ra khi cập nhật vai trò');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'athlete': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'coach': return 'Huấn luyện viên';
      case 'athlete': return 'Vận động viên';
      case 'user': return 'Người dùng';
      default: return 'Không xác định';
    }
  };

  const getPermissionText = (permission) => {
    switch (permission) {
      case 'tournament_manage': return 'Quản lý giải đấu';
      case 'user_manage': return 'Quản lý người dùng';
      case 'match_manage': return 'Quản lý trận đấu';
      case 'registration_approve': return 'Phê duyệt đăng ký';
      case 'statistics_view': return 'Xem thống kê';
      case 'notification_send': return 'Gửi thông báo';
      default: return permission;
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Bạn không có quyền truy cập trang quản lý phân quyền</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Users List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Quản lý vai trò người dùng</h3>
          {!isConnected && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Không có kết nối realtime - thay đổi có thể không cập nhật ngay lập tức
            </p>
          )}
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.name || 'Không có tên'}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                    
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={!isConnected}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {getRoleText(role.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {user.updated_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Cập nhật: {new Date(user.updated_at).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles and Permissions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Vai trò và quyền hạn</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role.name)}`}>
                    {getRoleText(role.name)}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {role.users_count || 0} người dùng
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-700">Quyền hạn:</h5>
                  <div className="space-y-1">
                    {role.permissions && role.permissions.length > 0 ? (
                      role.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">
                            {getPermissionText(permission)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">Không có quyền hạn đặc biệt</p>
                    )}
                  </div>
                </div>
                
                {role.updated_at && (
                  <p className="text-xs text-gray-500 mt-3">
                    Cập nhật: {new Date(role.updated_at).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Realtime Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Kết nối realtime hoạt động' : 'Không có kết nối realtime'}
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {isConnected 
            ? 'Các thay đổi vai trò sẽ được cập nhật realtime cho tất cả người dùng'
            : 'Các thay đổi chỉ được cập nhật khi refresh trang'
          }
        </p>
      </div>
    </div>
  );
};

export default RolePermissionManager; 