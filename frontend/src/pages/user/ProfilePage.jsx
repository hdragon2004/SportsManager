import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axiosClient from '../../services/axiosClient';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

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
    </div>
  );
};

export default ProfilePage;
