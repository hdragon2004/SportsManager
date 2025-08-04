import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosClient from '../services/axiosClient';

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);

  const [formData, setFormData] = useState({
    tournament_id: '',
    team_id: '',
    note: ''
  });

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axiosClient.get('/registrations');
        console.log('Registrations response:', response);
        console.log('Registrations data:', response.data);
        
        // Kiểm tra và lấy dữ liệu registrations
        let registrationsData = [];
        if (Array.isArray(response.data)) {
          registrationsData = response.data;
        } else if (response.data && Array.isArray(response.data.registrations)) {
          registrationsData = response.data.registrations;
        } else if (response.data && Array.isArray(response.data.data)) {
          registrationsData = response.data.data;
        } else {
          console.warn('Registrations data is not an array:', response.data);
          registrationsData = [];
        }
        
        console.log('Processed registrations data:', registrationsData);
        setRegistrations(registrationsData);
      } catch (error) {
        console.error('Error fetching registrations:', error);
        setRegistrations([]);
      }
    };

    const fetchTournaments = async () => {
      try {
        const response = await axiosClient.get('/tournaments');
        console.log('Tournaments response:', response);
        console.log('Tournaments data:', response.data);
        
        // Kiểm tra và lấy dữ liệu tournaments
        let tournamentsData = [];
        if (Array.isArray(response.data)) {
          tournamentsData = response.data;
        } else if (response.data && Array.isArray(response.data.tournaments)) {
          tournamentsData = response.data.tournaments;
        } else if (response.data && Array.isArray(response.data.data)) {
          tournamentsData = response.data.data;
        } else {
          console.warn('Tournaments data is not an array:', response.data);
          tournamentsData = [];
        }
        
        console.log('Processed tournaments data:', tournamentsData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setTournaments([]);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axiosClient.get('/teams');
        console.log('Teams response:', response);
        console.log('Teams data:', response.data);
        
        // Kiểm tra và lấy dữ liệu teams
        let teamsData = [];
        if (Array.isArray(response.data)) {
          teamsData = response.data;
        } else if (response.data && Array.isArray(response.data.teams)) {
          teamsData = response.data.teams;
        } else if (response.data && Array.isArray(response.data.data)) {
          teamsData = response.data.data;
        } else {
          console.warn('Teams data is not an array:', response.data);
          teamsData = [];
        }
        
        console.log('Processed teams data:', teamsData);
        setTeams(teamsData);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchRegistrations();
    fetchTournaments();
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRegistration) {
        // Update registration
                  const response = await axiosClient.put(`/registrations/${editingRegistration.id}`, formData);
        console.log('Registration updated:', response.data);
        setRegistrations(registrations.map(r => 
          r.id === editingRegistration.id ? { ...r, ...response.data } : r
        ));
      } else {
        // Create new registration
                  const response = await axiosClient.post('/registrations', formData);
        console.log('Registration created:', response.data);
        setRegistrations([...registrations, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving registration:', error);
      alert('Có lỗi xảy ra khi lưu đăng ký');
    }
  };

  const handleEdit = (registration) => {
    setEditingRegistration(registration);
    setFormData({
      tournament_id: registration.tournament_id || '',
      team_id: registration.team_id || '',
      note: registration.note || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đăng ký này?')) {
      try {
        await axiosClient.delete(`/registrations/${id}`);
        console.log('Registration deleted:', id);
        setRegistrations(registrations.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting registration:', error);
        alert('Có lỗi xảy ra khi xóa đăng ký');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      if (newStatus === 'approved') {
        await axiosClient.post(`/registrations/${id}/approve`);
      } else if (newStatus === 'rejected') {
                  await axiosClient.post(`/registrations/${id}/reject`, { reason: 'Từ chối bởi admin' });
      }
      console.log('Registration status updated:', id, newStatus);
      setRegistrations(registrations.map(r => 
        r.id === id ? { ...r, approval_status: newStatus } : r
      ));
    } catch (error) {
      console.error('Error updating registration status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đăng ký');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRegistration(null);
    setFormData({
      tournament_id: '',
      team_id: '',
      note: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Không xác định';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Đăng ký</h1>
            <p className="text-gray-600">Quản lý đăng ký tham gia giải đấu</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Thêm Đăng ký
          </Button>
        </div>

        {/* Registration List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danh sách Đăng ký</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giải đấu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đội
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chủ đội
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian đăng ký
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{registration.tournament}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.team}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.team_owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(registration.approval_status)}`}>
                          {getStatusText(registration.approval_status)}
                        </span>
                        {registration.approval_status === 'pending' && (
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStatusChange(registration.id, 'approved')}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleStatusChange(registration.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              ✗
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.note}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(registration)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(registration.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRegistration ? 'Sửa Đăng ký' : 'Thêm Đăng ký'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giải đấu
              </label>
              <select
                value={formData.tournament_id}
                onChange={(e) => setFormData({...formData, tournament_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn giải đấu</option>
                {tournaments.map(tournament => (
                  <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đội
              </label>
              <select
                value={formData.team_id}
                onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn đội</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name} - {team.owner}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ghi chú về đăng ký..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingRegistration ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default RegistrationsPage; 