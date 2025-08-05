import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const RealtimeRegistration = ({ tournamentId, onRegistrationUpdate }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationForm, setRegistrationForm] = useState({
    team_name: '',
    captain_name: '',
    phone: '',
    email: '',
    players: []
  });

  // Fetch registrations
  useEffect(() => {
    if (tournamentId) {
      fetchRegistrations();
    }
  }, [tournamentId]);

  // Listen for realtime registration updates
  useEffect(() => {
    if (!socket) return;

    socket.on('registrationStatus', (data) => {
      console.log('Registration status update received:', data);
      updateRegistrationStatus(data);
    });

    socket.on('newRegistration', (data) => {
      console.log('New registration received:', data);
      addNewRegistration(data.registration);
    });

    return () => {
      socket.off('registrationStatus');
      socket.off('newRegistration');
    };
  }, [socket]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/tournaments/${tournamentId}/registrations`);
      setRegistrations(response.data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = (data) => {
    setRegistrations(prev => 
      prev.map(reg => 
        reg.id === data.registrationId 
          ? { ...reg, status: data.status, updated_at: new Date() }
          : reg
      )
    );
    
    if (onRegistrationUpdate) {
      onRegistrationUpdate();
    }
  };

  const addNewRegistration = (newRegistration) => {
    setRegistrations(prev => [newRegistration, ...prev]);
    
    if (onRegistrationUpdate) {
      onRegistrationUpdate();
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để đăng ký');
      return;
    }

    try {
      const response = await axiosClient.post(`/tournaments/${tournamentId}/register`, {
        ...registrationForm,
        user_id: user.id
      });

      if (response.data.success) {
        alert('Đăng ký thành công! Vui lòng chờ xác nhận.');
        setRegistrationForm({
          team_name: '',
          captain_name: '',
          phone: '',
          email: '',
          players: []
        });
        
        // Emit to socket for realtime update
        if (socket) {
          socket.emit('newRegistration', {
            tournamentId,
            registration: response.data.data
          });
        }
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Có lỗi xảy ra khi đăng ký');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'approved': return 'Đã chấp thuận';
      case 'rejected': return 'Đã từ chối';
      default: return 'Không xác định';
    }
  };

  return (
    <div className="space-y-6">
      {/* Registration Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Đăng ký thi đấu</h3>
        
        <form onSubmit={handleSubmitRegistration} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đội
              </label>
              <input
                type="text"
                value={registrationForm.team_name}
                onChange={(e) => setRegistrationForm(prev => ({ ...prev, team_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên đội trưởng
              </label>
              <input
                type="text"
                value={registrationForm.captain_name}
                onChange={(e) => setRegistrationForm(prev => ({ ...prev, captain_name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={registrationForm.phone}
                onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={registrationForm.email}
                onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isConnected}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnected ? 'Đăng ký thi đấu' : 'Đang kết nối...'}
          </button>
        </form>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Danh sách đăng ký</h3>
          {!isConnected && (
            <p className="text-sm text-red-600 mt-1">
              ⚠️ Không có kết nối realtime - dữ liệu có thể không cập nhật
            </p>
          )}
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : registrations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Chưa có đăng ký nào</p>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{registration.team_name}</h4>
                      <p className="text-sm text-gray-600">
                        Đội trưởng: {registration.captain_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        SĐT: {registration.phone}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusText(registration.status)}
                      </span>
                      {registration.status === 'pending' && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  {registration.updated_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Cập nhật: {new Date(registration.updated_at).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtimeRegistration; 