import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RequestPermissionForm from '../components/RequestPermissionForm';
import { getAllPermissions } from '../features/permissions/permissionAPI';

const CoachPermissionPage = () => {
  const { user, isCoach } = useAuth();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('request');

  useEffect(() => {
    if (user) {
      fetchUserPermissions();
    }
  }, [user]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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

  const getRoleText = (roleId) => {
    switch (roleId) {
      case 4:
        return 'Huấn luyện viên';
      default:
        return 'Không xác định';
    }
  };

  if (isCoach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quyền Huấn luyện viên
              </h1>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Bạn đã có quyền huấn luyện viên
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Chúc mừng!
                </h2>
                <p className="text-gray-600 mb-6">
                  Bạn đã được cấp quyền huấn luyện viên. Bây giờ bạn có thể:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Quản lý đội bóng</h3>
                      <p className="text-sm text-gray-600">Tạo và quản lý các đội bóng</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Đăng ký giải đấu</h3>
                      <p className="text-sm text-gray-600">Đăng ký đội tham gia các giải đấu</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Xem thống kê</h3>
                      <p className="text-sm text-gray-600">Xem thống kê chi tiết của đội</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V4a1 1 0 00-1-1H5a1 1 0 00-1 1v1zM14 5h6V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Quản lý lịch thi đấu</h3>
                      <p className="text-sm text-gray-600">Xem và quản lý lịch thi đấu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Xin cấp quyền Huấn luyện viên
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Gửi yêu cầu để được cấp quyền huấn luyện viên. Quyền này cho phép bạn quản lý đội bóng và tham gia các hoạt động huấn luyện.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('request')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'request'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gửi yêu cầu
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'history'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Lịch sử yêu cầu
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'request' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <RequestPermissionForm />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Lịch sử yêu cầu</h3>
                  <p className="text-gray-600 mt-1">Xem lại các yêu cầu quyền của bạn</p>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Đang tải...</p>
                    </div>
                  ) : permissions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có yêu cầu nào</h3>
                      <p className="text-gray-600">Bạn chưa gửi yêu cầu xin quyền nào</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {getRoleText(permission.Role_ID)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Yêu cầu ngày {new Date(permission.requestDate).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(permission.status)}`}>
                              {getStatusText(permission.status)}
                            </span>
                          </div>

                          {permission.reason && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Lý do:</h5>
                              <p className="text-gray-600">{permission.reason}</p>
                            </div>
                          )}

                          {permission.status === 'rejected' && permission.adminNote && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-red-700 mb-2">Lý do từ chối:</h5>
                              <p className="text-red-600">{permission.adminNote}</p>
                            </div>
                          )}

                          {permission.status === 'approved' && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-800 font-medium">Quyền đã được cấp thành công!</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Thông tin về quyền Huấn luyện viên</h3>
                <div className="space-y-3 text-blue-800">
                  <p>• <strong>Quản lý đội bóng:</strong> Tạo, chỉnh sửa và quản lý thông tin đội bóng</p>
                  <p>• <strong>Đăng ký giải đấu:</strong> Đăng ký đội tham gia các giải đấu</p>
                  <p>• <strong>Xem thống kê:</strong> Truy cập thống kê chi tiết của đội</p>
                  <p>• <strong>Quản lý thành viên:</strong> Thêm/xóa thành viên trong đội</p>
                  <p>• <strong>Thời gian xử lý:</strong> Yêu cầu thường được xử lý trong vòng 24-48 giờ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPermissionPage; 