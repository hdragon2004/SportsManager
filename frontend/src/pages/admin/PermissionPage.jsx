import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllPermissions, updatePermissionStatus } from '../../features/permissions/permissionAPI';

const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [error, setError] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllPermissions();
      console.log('Permissions API response:', response.data);
      
      if (response.data.success) {
        setPermissions(response.data.data);
      } else {
        setError('Không thể tải dữ liệu yêu cầu quyền');
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu yêu cầu quyền');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await updatePermissionStatus(id, { 
        status: 'approved',
        note: note || 'Yêu cầu được chấp thuận'
      });
      
      if (response.data.success) {
        // Cập nhật state local
        setPermissions(prev => 
          prev.map(perm => 
            perm.id === id ? { ...perm, status: 'approved', note: note || 'Yêu cầu được chấp thuận' } : perm
          )
        );
        setIsModalOpen(false);
        setSelectedPermission(null);
        setNote('');
        alert('Đã duyệt yêu cầu quyền thành công!');
      } else {
        alert('Có lỗi xảy ra khi duyệt yêu cầu quyền');
      }
    } catch (error) {
      console.error('Error approving permission:', error);
      alert('Có lỗi xảy ra khi duyệt yêu cầu quyền');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await updatePermissionStatus(id, { 
        status: 'rejected',
        note: note || 'Yêu cầu bị từ chối'
      });
      
      if (response.data.success) {
        // Cập nhật state local
        setPermissions(prev => 
          prev.map(perm => 
            perm.id === id ? { ...perm, status: 'rejected', note: note || 'Yêu cầu bị từ chối' } : perm
          )
        );
        setIsModalOpen(false);
        setSelectedPermission(null);
        setNote('');
        alert('Đã từ chối yêu cầu quyền thành công!');
      } else {
        alert('Có lỗi xảy ra khi từ chối yêu cầu quyền');
      }
    } catch (error) {
      console.error('Error rejecting permission:', error);
      alert('Có lỗi xảy ra khi từ chối yêu cầu quyền');
    }
  };

  const openModal = (permission, action) => {
    setSelectedPermission({ ...permission, action });
    setIsModalOpen(true);
    setNote('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPermission(null);
    setNote('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return 'Coach';
      case 4:
        return 'Huấn luyện viên';
      default:
        return `Role ${roleId}`;
    }
  };

  const filteredPermissions = permissions.filter(perm => {
    if (filter === 'all') return true;
    return perm.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#30ddff] via-blue-600 to-purple-600 px-6 py-4 relative">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white">Quản lý Yêu cầu Quyền</h1>
            <p className="text-blue-100 mt-1">Duyệt hoặc từ chối yêu cầu cấp quyền từ người dùng</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-300">Lọc theo trạng thái:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              <option value="all">Tất cả</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span>Tổng: {permissions.length}</span>
            <span>Chờ duyệt: {permissions.filter(p => p.status === 'pending').length}</span>
            <span>Đã duyệt: {permissions.filter(p => p.status === 'approved').length}</span>
            <span>Từ chối: {permissions.filter(p => p.status === 'rejected').length}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* Permissions List */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
        <div className="p-6">
          {filteredPermissions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-300">Không có yêu cầu quyền</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'Chưa có yêu cầu quyền nào' : `Không có yêu cầu nào ở trạng thái "${getStatusText(filter)}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPermissions.map((permission) => (
                <div key={permission.id} className="bg-gray-700/50 rounded-xl p-6 hover:bg-gray-700/70 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {permission.User?.name || `User ${permission.User_ID}`}
                          </h3>
                          <p className="text-gray-400">{permission.User?.email || 'Không có email'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Thông tin yêu cầu:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Quyền yêu cầu:</span>
                              <span className="text-white font-medium">{getRoleName(permission.Role_ID)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ngày yêu cầu:</span>
                              <span className="text-white">
                                {new Date(permission.requestDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Lý do:</span>
                              <span className="text-white">{permission.reason || 'Không có lý do'}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Trạng thái:</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Trạng thái:</span>
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(permission.status)}`}>
                                {getStatusText(permission.status)}
                              </span>
                            </div>
                            {permission.note && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Ghi chú:</span>
                                <span className="text-white text-sm">{permission.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {permission.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(permission, 'approve')}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-300 text-sm font-medium"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => openModal(permission, 'reject')}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPermission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedPermission.action === 'approve' ? 'Duyệt yêu cầu' : 'Từ chối yêu cầu'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                {selectedPermission.action === 'approve' 
                  ? `Bạn có chắc muốn duyệt yêu cầu quyền "${getRoleName(selectedPermission.Role_ID)}" cho ${selectedPermission.User?.name || `User ${selectedPermission.User_ID}`}?`
                  : `Bạn có chắc muốn từ chối yêu cầu quyền "${getRoleName(selectedPermission.Role_ID)}" cho ${selectedPermission.User?.name || `User ${selectedPermission.User_ID}`}?`
                }
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ghi chú (tùy chọn):
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder={selectedPermission.action === 'approve' ? 'Ghi chú khi duyệt...' : 'Lý do từ chối...'}
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                Hủy
              </button>
              <button
                onClick={() => selectedPermission.action === 'approve' 
                  ? handleApprove(selectedPermission.id)
                  : handleReject(selectedPermission.id)
                }
                className={`flex-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedPermission.action === 'approve'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {selectedPermission.action === 'approve' ? 'Duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionPage;
