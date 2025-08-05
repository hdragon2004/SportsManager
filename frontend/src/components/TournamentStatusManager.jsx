import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const TournamentStatusManager = ({ tournamentId, onStatusUpdate }) => {
  const { user, isAdmin } = useAuth();
  const { socket, isConnected } = useSocket();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusForm, setStatusForm] = useState({
    status: '',
    message: ''
  });

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  // Listen for realtime status updates
  useEffect(() => {
    if (!socket) return;

    socket.on('tournamentStatusUpdate', (data) => {
      console.log('Tournament status update received:', data);
      updateTournamentStatus(data);
    });

    socket.on('tournamentPhaseChange', (data) => {
      console.log('Tournament phase change received:', data);
      updateTournamentPhase(data);
    });

    return () => {
      socket.off('tournamentStatusUpdate');
      socket.off('tournamentPhaseChange');
    };
  }, [socket]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/tournaments/${tournamentId}`);
      setTournament(response.data);
    } catch (error) {
      console.error('Error fetching tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentStatus = (data) => {
    setTournament(prev => ({
      ...prev,
      status: data.status,
      updated_at: new Date()
    }));
    
    if (onStatusUpdate) {
      onStatusUpdate();
    }
  };

  const updateTournamentPhase = (data) => {
    setTournament(prev => ({
      ...prev,
      phase: data.phase,
      phase_updated_at: new Date()
    }));
    
    if (onStatusUpdate) {
      onStatusUpdate();
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) {
      alert('Bạn không có quyền thay đổi trạng thái giải đấu');
      return;
    }

    try {
      const response = await axiosClient.put(`/tournaments/${tournamentId}/status`, {
        status: newStatus,
        message: statusForm.message
      });

      if (response.data.success) {
        // Emit to socket for realtime update
        if (socket) {
          socket.emit('tournamentStatusUpdate', {
            tournamentId,
            status: newStatus,
            message: statusForm.message,
            updatedBy: user.id
          });
        }

        setStatusForm({ status: '', message: '' });
        alert('Cập nhật trạng thái thành công!');
      }
    } catch (error) {
      console.error('Error updating tournament status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const sendConfirmationNotification = async (registrationId, action) => {
    try {
      const response = await axiosClient.post(`/registrations/${registrationId}/${action}`, {
        message: statusForm.message
      });

      if (response.data.success) {
        // Emit to socket for realtime notification
        if (socket) {
          socket.emit('registrationStatus', {
            registrationId,
            status: action === 'approve' ? 'approved' : 'rejected',
            message: statusForm.message,
            tournamentId
          });
        }

        setStatusForm({ status: '', message: '' });
        alert(`Đã ${action === 'approve' ? 'chấp thuận' : 'từ chối'} đăng ký!`);
      }
    } catch (error) {
      console.error('Error sending confirmation:', error);
      alert('Có lỗi xảy ra khi gửi thông báo xác nhận');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'registration': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      case 'registration': return 'Đang đăng ký';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'group_stage': return 'bg-purple-100 text-purple-800';
      case 'knockout': return 'bg-orange-100 text-orange-800';
      case 'final': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseText = (phase) => {
    switch (phase) {
      case 'group_stage': return 'Vòng bảng';
      case 'knockout': return 'Vòng loại trực tiếp';
      case 'final': return 'Chung kết';
      default: return 'Chưa xác định';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!tournament) {
    return <p className="text-center text-gray-500">Không tìm thấy thông tin giải đấu</p>;
  }

  return (
    <div className="space-y-6">
      {/* Current Status Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Trạng thái giải đấu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Trạng thái hiện tại:</label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
              {getStatusText(tournament.status)}
            </span>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Giai đoạn:</label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor(tournament.phase)}`}>
              {getPhaseText(tournament.phase)}
            </span>
          </div>
        </div>

        {tournament.updated_at && (
          <p className="text-xs text-gray-500 mt-2">
            Cập nhật lần cuối: {new Date(tournament.updated_at).toLocaleString('vi-VN')}
          </p>
        )}
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quản lý trạng thái (Admin)</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thay đổi trạng thái:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['registration', 'upcoming', 'active', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={!isConnected}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú (tùy chọn):
              </label>
              <textarea
                value={statusForm.message}
                onChange={(e) => setStatusForm(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Nhập ghi chú cho thay đổi trạng thái..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Realtime Status Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Kết nối realtime hoạt động' : 'Không có kết nối realtime'}
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {isConnected 
            ? 'Các thay đổi sẽ được cập nhật realtime cho tất cả người dùng'
            : 'Các thay đổi chỉ được cập nhật khi refresh trang'
          }
        </p>
      </div>
    </div>
  );
};

export default TournamentStatusManager; 