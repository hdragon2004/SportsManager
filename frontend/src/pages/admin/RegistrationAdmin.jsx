import React, { useState, useEffect } from 'react';
import { getAllRegistrations, updateRegistration } from '../../features/registrations/registrationAPI';
import { useAuth } from '../../contexts/AuthContext';

const RegistrationAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllRegistrations();
      console.log('Registrations API response:', response.data);
      
      if (response.data.success) {
        setRegistrations(response.data.data);
      } else {
        setError('Không thể tải dữ liệu đăng ký');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await updateRegistration(id, { approval_status: 'approved' });
      
      if (response.data.success) {
        // Cập nhật state local
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === id ? { ...reg, approval_status: 'approved' } : reg
          )
        );
        alert('Đã duyệt đăng ký thành công!');
      } else {
        alert('Có lỗi xảy ra khi duyệt đăng ký');
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      alert('Có lỗi xảy ra khi duyệt đăng ký');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Lý do từ chối (tùy chọn):');
    if (reason === null) return; // User cancelled
    
    try {
      const response = await updateRegistration(id, { 
        approval_status: 'rejected',
        note: reason || 'Đăng ký bị từ chối'
      });
      
      if (response.data.success) {
        // Cập nhật state local
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === id ? { ...reg, approval_status: 'rejected', note: reason || 'Đăng ký bị từ chối' } : reg
          )
        );
        alert('Đã từ chối đăng ký thành công!');
      } else {
        alert('Có lỗi xảy ra khi từ chối đăng ký');
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      alert('Có lỗi xảy ra khi từ chối đăng ký');
    }
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

  const filteredRegistrations = registrations.filter(reg => {
    if (filter === 'all') return true;
    return reg.approval_status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchRegistrations}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Thử lại
        </button>
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
            <h1 className="text-3xl font-bold text-white mb-2">Quản lý phiếu đăng ký thi đấu</h1>
            <p className="text-blue-100 text-lg">Xử lý các phiếu đăng ký từ huấn luyện viên</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Tổng phiếu</p>
              <p className="text-2xl font-bold text-white">{registrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Chờ duyệt</p>
              <p className="text-2xl font-bold text-white">
                {registrations.filter(r => r.approval_status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Đã duyệt</p>
              <p className="text-2xl font-bold text-white">
                {registrations.filter(r => r.approval_status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Từ chối</p>
              <p className="text-2xl font-bold text-white">
                {registrations.filter(r => r.approval_status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Tất cả ({registrations.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Chờ duyệt ({registrations.filter(r => r.approval_status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Đã duyệt ({registrations.filter(r => r.approval_status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Từ chối ({registrations.filter(r => r.approval_status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-6">
        {filteredRegistrations.map((registration) => (
          <div key={registration.id} className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {registration.Team?.name || 'Không có tên đội'}
                  </h3>
                  <p className="text-gray-400 mb-1">
                    Giải đấu: {registration.Tournament?.name || 'Không có tên giải đấu'}
                  </p>
                  <p className="text-gray-400 mb-1">
                    Huấn luyện viên: {registration.Team?.User?.name || 'Không có thông tin'}
                  </p>
                  <p className="text-gray-400 mb-1">
                    Email: {registration.Team?.User?.email || 'Không có email'}
                  </p>
                  <p className="text-gray-400 mb-1">
                    Ngày đăng ký: {new Date(registration.time).toLocaleDateString('vi-VN')}
                  </p>
                  {registration.note && (
                    <p className="text-gray-400 mb-1">
                      Ghi chú: {registration.note}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(registration.approval_status)}`}>
                    {getStatusText(registration.approval_status)}
                  </span>
                  {registration.approval_status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(registration.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-300 text-sm font-medium"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(registration.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-medium text-white mb-3">Thông tin đội:</h4>
                <p className="text-gray-300">
                  {registration.Team?.description || 'Không có mô tả'}
                </p>
              </div>

              {/* Team Members Info */}
              {registration.Team?.Team_Members && registration.Team.Team_Members.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">
                    Danh sách thành viên ({registration.Team.Team_Members.length} người):
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registration.Team.Team_Members.map((member, index) => (
                      <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white">{member.name || 'Không có tên'}</h5>
                          <span className="text-xs text-gray-400">#{member.studentId || 'N/A'}</span>
                        </div>
                        <p className="text-sm text-gray-400">Vị trí: {member.position || 'Chưa xác định'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRegistrations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">Không có phiếu đăng ký nào</h3>
          <p className="text-gray-400">Không có phiếu đăng ký nào phù hợp với bộ lọc hiện tại.</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationAdmin;
