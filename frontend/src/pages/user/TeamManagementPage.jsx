// frontend\src\pages\user\TeamManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import Button from '../../components/Button';

const TeamManagementPage = () => {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    dateOfBirth: ''
  });

  useEffect(() => {
    const fetchTeamDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/teams/${teamId}`);
        setTeam(response.data.data);
      } catch (error)
      {
        console.error(`Lỗi khi tải thông tin đội ${teamId}:`, error);
        setTeam(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setMemberForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      dateOfBirth: ''
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMemberForm({
      name: '',
      age: '',
      gender: '',
      phone: '',
      dateOfBirth: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMember = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim()) {
      alert('Vui lòng nhập tên thành viên');
      return;
    }
    handleAddMember(memberForm);
  };

  const handleAddMember = async (memberData) => {
    setAddingMember(true);
    try {
      await axiosClient.post(`/team-members`, {
        Team_ID: teamId,
        name: memberData.name,
        age: memberData.age,
        gender: memberData.gender,
        phone: memberData.phone,
        dateOfBirth: memberData.dateOfBirth
      });
      
      // Cập nhật lại thông tin đội
      const response = await axiosClient.get(`/teams/${teamId}`);
      setTeam(response.data.data);
      
      alert(`Đã thêm ${memberData.name} vào đội thành công!`);
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi thêm thành viên:', error);
      alert(`Thêm thành viên thất bại: ${error.response?.data?.message || 'Vui lòng thử lại.'}`);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${memberName} khỏi đội?`)) {
      return;
    }

    try {
      await axiosClient.delete(`/team-members/${memberId}`);
      
      // Cập nhật lại thông tin đội
      const response = await axiosClient.get(`/teams/${teamId}`);
      setTeam(response.data.data);
      
      alert(`Đã xóa ${memberName} khỏi đội thành công!`);
    } catch (error) {
      console.error('Lỗi khi xóa thành viên:', error);
      alert(`Xóa thành viên thất bại: ${error.response?.data?.message || 'Vui lòng thử lại.'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-red-600">Không tìm thấy đội</h2>
        <p className="text-gray-600 mt-2">Không thể tải được thông tin của đội. Vui lòng thử lại.</p>
        <Link to="/user/my-teams" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Quay lại danh sách đội
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <Link to="/user/my-teams" className="text-sm text-blue-600 hover:underline mb-4 block">
          ← Quay lại danh sách đội
        </Link>
        <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                {team.logo ? <img src={team.logo} alt={team.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-2xl font-bold text-blue-600">{team.name.charAt(0)}</span>}
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                <p className="text-gray-500">{team.teamCode}</p>
            </div>
        </div>
      </div>

      {/* Team Details & Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Team Info */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Thông tin đội</h2>
          <div>
            <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
            <dd className="mt-1 text-sm text-gray-900">{team.description || "Chưa có mô tả"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Ngày tạo</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date(team.createdAt).toLocaleDateString('vi-VN')}</dd>
          </div>
        </div>

        {/* Right Column: Members Management */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Quản lý thành viên ({team.Team_Members?.length || 0})</h2>
            <Button onClick={handleOpenModal} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
              Thêm thành viên
            </Button>
          </div>
          <div className="space-y-3">
            {team.Team_Members && team.Team_Members.length > 0 ? (
                team.Team_Members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">
                              {member.age && `Tuổi: ${member.age}`}
                              {member.gender && ` | Giới tính: ${member.gender}`}
                              {member.phone && ` | SĐT: ${member.phone}`}
                            </p>
                            <p className="text-sm text-gray-500">Ngày tham gia: {new Date(member.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <button 
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                          onClick={() => handleRemoveMember(member.id, member.name)}
                        >
                            Xóa
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-center py-4">Chưa có thành viên nào trong đội.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal thêm thành viên */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Thêm thành viên mới">
        <form onSubmit={handleSubmitMember} className="space-y-4">
          <Input
            label="Tên thành viên *"
            name="name"
            value={memberForm.name}
            onChange={handleInputChange}
            required
            placeholder="Nhập tên thành viên"
          />
          
          <Input
            label="Tuổi"
            name="age"
            type="number"
            value={memberForm.age}
            onChange={handleInputChange}
            placeholder="Nhập tuổi"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select
              name="gender"
              value={memberForm.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          
          <Input
            label="Số điện thoại"
            name="phone"
            value={memberForm.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
          />
          
          <Input
            label="Ngày sinh"
            name="dateOfBirth"
            type="date"
            value={memberForm.dateOfBirth}
            onChange={handleInputChange}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" disabled={addingMember}>
              {addingMember ? 'Đang thêm...' : 'Thêm thành viên'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamManagementPage;