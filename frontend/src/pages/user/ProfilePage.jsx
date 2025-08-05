import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../services/axiosClient';
import RequestPermissionForm from '../../components/RequestPermissionForm';
import { getAllPermissions } from '../../features/permissions/permissionAPI';

const ProfilePage = () => {
  const { user, isCoach, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  useEffect(() => {
    if (user) {
      fetchUserPermissions();
    }
  }, [user]);

  const fetchUserPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await getAllPermissions();
      if (response.data.success) {
        // Lọc chỉ những permission của user hiện tại
        const userPermissions = response.data.data.filter(
          permission => permission.User_ID === user.id
        );
        setPermissions(userPermissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosClient.put(`/users/${user.id}`, formData);
      if (response.data.success) {
        // Cập nhật user data trong context
        // TODO: Implement updateUser trong AuthContext
        console.log('Profile updated successfully');
        setIsEditing(false);
      } else {
        alert('Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setIsEditing(false);
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

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#30ddff] via-blue-600 to-purple-600 px-8 py-12 relative">
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-gray-800">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hồ sơ cá nhân</h1>
                <p className="text-blue-100 text-lg">Quản lý thông tin cá nhân của bạn</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold text-white">Thông tin cá nhân</h2>
              <div className="flex items-center space-x-3">
                {/* Button xin quyền huấn luyện viên - chỉ hiển thị cho user có role "user" */}
                {!isCoach && !isAdmin && (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Xin quyền HLV</span>
                  </button>
                )}
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-6 py-3 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 shadow-lg"
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-300"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Họ và tên */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff] transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white">
                    {user?.name || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff] transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white">
                    {user?.email || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff] transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white">
                    {user?.phone || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff] transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white">
                    {user?.address || 'Chưa cập nhật'}
                  </div>
                )}
              </div>
            </div>

            {/* Quyền hạn */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-white mb-6">Quyền hạn</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Vai trò hiện tại</p>
                      <p className="text-lg font-bold text-white">
                        {isAdmin ? 'Admin' : isCoach ? 'Huấn luyện viên' : 'Người dùng'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Yêu cầu quyền</p>
                      <p className="text-lg font-bold text-white">
                        {permissions.length > 0 ? `${permissions.length} yêu cầu` : 'Chưa có'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Trạng thái</p>
                      <p className="text-lg font-bold text-white">
                        {isCoach ? 'Đã có quyền' : 'Chưa có quyền'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lịch sử yêu cầu quyền */}
            {permissions.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-white mb-6">Lịch sử yêu cầu quyền</h3>
                
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">Xin quyền Huấn luyện viên</h4>
                            <p className="text-sm text-gray-400">
                              Yêu cầu ngày {new Date(permission.requestDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(permission.status)}`}>
                          {getStatusText(permission.status)}
                        </span>
                      </div>

                      {permission.reason && (
                        <div className="mt-4 bg-gray-700/50 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-300 mb-2">Lý do:</h5>
                          <p className="text-gray-400">{permission.reason}</p>
                        </div>
                      )}

                      {permission.status === 'rejected' && permission.note && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-red-400 mb-2">Lý do từ chối:</h5>
                          <p className="text-red-300">{permission.note}</p>
                        </div>
                      )}

                      {permission.status === 'approved' && (
                        <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400 font-medium">Quyền đã được cấp thành công!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thống kê */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-white mb-6">Thống kê hoạt động</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Giải đấu đã tham gia</p>
                      <p className="text-2xl font-bold text-white">5</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Đội đã tham gia</p>
                      <p className="text-2xl font-bold text-white">3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 hover:border-[#30ddff]/30 transition-all duration-300">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-400">Trận đã thi đấu</p>
                      <p className="text-2xl font-bold text-white">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal xin quyền huấn luyện viên */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Xin quyền huấn luyện viên</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <RequestPermissionForm />
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfilePage;
