import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosClient from '../services/axiosClient';

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    team_code: '',
    user_id: '',
    logo: '',
    description: ''
  });

  useEffect(() => {
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

    const fetchUsers = async () => {
      try {
        // Giả sử có API để lấy users cho dropdown
        // const response = await getAllUsers();
        // setUsers(response.data);
        setUsers([
          { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com' },
          { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com' },
          { id: 3, name: 'Lê Văn C', email: 'levanc@example.com' }
        ]);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchTeams();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        // Update team
                  const response = await axiosClient.put(`/teams/${editingTeam.id}`, formData);
        console.log('Team updated:', response.data);
        setTeams(teams.map(t => 
          t.id === editingTeam.id ? { ...t, ...response.data } : t
        ));
      } else {
        // Create new team
                  const response = await axiosClient.post('/teams', formData);
        console.log('Team created:', response.data);
        setTeams([...teams, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Có lỗi xảy ra khi lưu đội');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      team_code: team.team_code,
      user_id: team.user_id || '',
      logo: team.logo || '',
      description: team.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đội này?')) {
      try {
        await axiosClient.delete(`/teams/${id}`);
        console.log('Team deleted:', id);
        setTeams(teams.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Có lỗi xảy ra khi xóa đội');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
    setFormData({
      name: '',
      team_code: '',
      user_id: '',
      logo: '',
      description: ''
    });
  };

  const generateTeamCode = () => {
    const code = 'TEAM' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData({...formData, team_code: code});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Đội</h1>
            <p className="text-gray-600">Quản lý các đội thể thao</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Thêm Đội
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.team_code}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(team)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chủ đội:</span>
                    <span className="text-gray-900">{team.owner}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Số thành viên:</span>
                    <span className="text-gray-900">{team.member_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày tạo:</span>
                    <span className="text-gray-900">{team.created_at}</span>
                  </div>
                </div>
                
                {team.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeam ? 'Sửa Đội' : 'Thêm Đội'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên đội"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  label="Mã đội"
                  value={formData.team_code}
                  onChange={(e) => setFormData({...formData, team_code: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="secondary" onClick={generateTeamCode}>
                  Tạo mã
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chủ đội
              </label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chủ đội</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <Input
              label="Logo URL"
              value={formData.logo}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
              placeholder="https://example.com/logo.png"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả về đội..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingTeam ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TeamsPage; 