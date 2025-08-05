import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCoachRoleRequests, processCoachRoleRequest } from '../../features/permissions/permissionAPI';
import { useSocket } from '../../contexts/SocketContext';

const CoachPermissionAdmin = () => {
  const { isAdmin } = useAuth();
  const { socket, isConnected } = useSocket();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [action, setAction] = useState(''); // approve or reject

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Listen for realtime permission updates
  useEffect(() => {
    if (!socket) return;

    socket.on('permissionUpdate', (data) => {
      console.log('Permission update received:', data);
      updatePermissionInList(data);
    });

    return () => {
      socket.off('permissionUpdate');
    };
  }, [socket]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await getCoachRoleRequests();
      if (response.data.success) {
        setPermissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePermissionInList = (data) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.id === data.id 
          ? { ...permission, ...data }
          : permission
      )
    );
  };

  const handleAction = (permission, actionType) => {
    setSelectedPermission(permission);
    setAction(actionType);
    setAdminNote('');
    setShowModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedPermission) return;

    try {
      const updateData = {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminNote: adminNote
      };

      const response = await processCoachRoleRequest(selectedPermission.id, updateData);
      
      if (response.data.success) {
        // Emit to socket for realtime update
        if (socket) {
          socket.emit('permissionUpdate', {
            id: selectedPermission.id,
            ...updateData,
            updatedBy: 'admin'
          });
        }

        // Update local state
        updatePermissionInList({
          id: selectedPermission.id,
          ...updateData,
          processedDate: new Date()
        });

        setShowModal(false);
        setSelectedPermission(null);
        setAdminNote('');
        setAction('');
        
        alert(`Yêu cầu đã được ${action === 'approve' ? 'duyệt' : 'từ chối'} thành công!`);
      }
    } catch (error) {
      console.error('Error updating permission:', error);
      alert('Có lỗi xảy ra khi cập nhật yêu cầu');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Đã từ chối';
      case 'pending':
        return 'Đang chờ';
      default:
        return 'Không xác định';
    }
  };

  const getFilteredPermissions = () => {
    if (filter === 'all') return permissions;
    return permissions.filter(permission => permission.status === filter);
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12 relative">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-white mb-2">Không có quyền truy cập</h1>
              <p className="text-red-100 text-lg">Bạn không có quyền admin để truy cập trang này</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-400">Bạn không có quyền admin để truy cập trang này</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#30ddff] via-blue-600 to-purple-600 px-8 py-12 relative">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Quản lý yêu cầu quyền Huấn luyện viên</h1>
            <p className="text-blue-100 text-lg">Duyệt hoặc từ chối các yêu cầu xin quyền huấn luyện viên từ người dùng</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-300">Lọc theo trạng thái:</span>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'Tất cả', color: 'bg-gray-700 text-gray-300' },
                { value: 'pending', label: 'Đang chờ', color: 'bg-yellow-500 text-white' },
                { value: 'approved', label: 'Đã duyệt', color: 'bg-green-500 text-white' },
                { value: 'rejected', label: 'Đã từ chối', color: 'bg-red-500 text-white' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === option.value
                      ? option.color + ' shadow-md'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Realtime hoạt động' : 'Không có kết nối realtime'}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Danh sách yêu cầu ({getFilteredPermissions().length})
            </h3>
            <button
              onClick={fetchPermissions}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-400">Đang tải...</p>
            </div>
          ) : getFilteredPermissions().length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Không có yêu cầu nào</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Chưa có yêu cầu xin quyền nào'
                  : `Không có yêu cầu nào ở trạng thái "${getStatusText(filter)}"`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredPermissions().map((permission) => (
                <div
                  key={permission.id}
                  className="border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {permission.User?.name || 'Không có tên'}
                          </h4>
                          <p className="text-sm text-gray-400">{permission.User?.email}</p>
                          <p className="text-xs text-gray-500">
                            Yêu cầu ngày {new Date(permission.requestDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(permission.status)}`}>
                          {getStatusText(permission.status)}
                        </span>
                      </div>

                      {permission.reason && (
                        <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Lý do xin quyền:</h5>
                          <p className="text-gray-400">{permission.reason}</p>
                        </div>
                      )}

                      {permission.note && (
                        <div className={`rounded-lg p-4 mb-4 ${
                          permission.status === 'rejected' 
                            ? 'bg-red-500/10 border border-red-500/20' 
                            : 'bg-green-500/10 border border-green-500/20'
                        }`}>
                          <h5 className={`text-sm font-medium mb-2 ${
                            permission.status === 'rejected' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            Ghi chú admin:
                          </h5>
                          <p className={permission.status === 'rejected' ? 'text-red-300' : 'text-green-300'}>
                            {permission.note}
                          </p>
                        </div>
                      )}

                      {permission.processedDate && (
                        <p className="text-xs text-gray-500">
                          Xử lý ngày {new Date(permission.processedDate).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>

                    {permission.status === 'pending' && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleAction(permission, 'approve')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleAction(permission, 'reject')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              {action === 'approve' ? 'Duyệt yêu cầu' : 'Từ chối yêu cầu'}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">
                {action === 'approve' 
                  ? 'Bạn có muốn duyệt yêu cầu này không?'
                  : 'Bạn có muốn từ chối yêu cầu này không?'
                }
              </p>
              <p className="text-sm font-medium text-white">
                Người yêu cầu: {selectedPermission.User?.name || 'Không có tên'}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ghi chú (tùy chọn):
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder={action === 'approve' 
                  ? 'Ghi chú khi duyệt yêu cầu...'
                  : 'Lý do từ chối yêu cầu...'
                }
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedPermission(null);
                  setAdminNote('');
                  setAction('');
                }}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  action === 'approve' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {action === 'approve' ? 'Duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachPermissionAdmin; 