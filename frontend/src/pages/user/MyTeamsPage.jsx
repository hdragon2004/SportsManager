// frontend\src\pages\user\MyTeamsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const MyTeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null); // null: create, object: edit
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    teamCode: '',
    logo: '',
    description: '',
  });

  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/teams');
      setTeams(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách đội:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        teamCode: team.teamCode || '',
        logo: team.logo || '',
        description: team.description || '',
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        teamCode: '',
        logo: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTeam) {
        // Chức năng cập nhật
        await axiosClient.put(`/teams/${editingTeam.id}`, formData);
      } else {
        // Chức năng tạo mới
        await axiosClient.post('/teams', formData);
      }
      fetchMyTeams(); // Tải lại danh sách đội sau khi lưu
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi lưu đội:', error);
      alert(`Lưu thất bại: ${error.response?.data?.message || 'Vui lòng thử lại.'}`);
    }
  };

  const getStatusColor = (status) => {
    return 'bg-green-100 text-green-800'; // Mặc định là active
  };

  const getSportIcon = () => {
    return 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';
  };

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
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đội của tôi</h1>
              <p className="text-gray-600">
                Quản lý các đội bạn đã tạo
              </p>
            </div>
            <Button onClick={() => handleOpenModal()}>
              Tạo đội mới
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSportIcon()} />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số đội</p>
                <p className="text-2xl font-semibold text-gray-900">{teams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.filter(t => t.status !== 'inactive').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {teams.reduce((sum, team) => sum + (team.Team_Members?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.length > 0 ? (
            teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSportIcon()} />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-500">{team.teamCode || 'Chưa có mã'}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(team.status || 'active')}`}>
                      Hoạt động
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{team.description || 'Chưa có mô tả.'}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Thành viên:</span>
                      <span className="font-medium">{team.Team_Members?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="font-medium">{new Date(team.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => navigate(`/user/my-teams/${team.id}/manage`)} // Chuyển hướng tới trang quản lý chi tiết
                    >
                      Quản lý
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => handleOpenModal(team)}
                    >
                      Chỉnh sửa
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đội nào</h3>
                <p className="mt-1 text-sm text-gray-500">Hãy tạo đội đầu tiên của bạn!</p>
            </div>
          )}
        </div>

        {/* Modal for Create/Edit Team */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTeam ? 'Chỉnh sửa đội' : 'Tạo đội mới'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên đội"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Mã đội (Tùy chọn)"
              name="teamCode"
              value={formData.teamCode}
              onChange={handleInputChange}
            />
            <Input
              label="Logo (URL)"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingTeam ? 'Lưu thay đổi' : 'Tạo đội'}
              </Button>
            </div>
          </form>
        </Modal>
    </div>
  );
};

export default MyTeamsPage;