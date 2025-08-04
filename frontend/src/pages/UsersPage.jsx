import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosClient from '../services/axiosClient';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    password: '',
    avatar: '',
    is_active: true,
    roles: []
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosClient.get('/users');
        console.log('Users response:', response);
        console.log('Users data:', response.data);
        
        // Kiểm tra và lấy dữ liệu users
        let usersData = [];
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data && Array.isArray(response.data.users)) {
          usersData = response.data.users;
        } else if (response.data && Array.isArray(response.data.data)) {
          usersData = response.data.data;
        } else {
          console.warn('Users data is not an array:', response.data);
          usersData = [];
        }
        
        console.log('Processed users data:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    const fetchRoles = async () => {
      try {
        // Giả sử có API để lấy roles
        // const response = await getAllRoles();
        // setRoles(response.data);
        setRoles([
          { id: 1, name: 'admin', description: 'Quản trị viên' },
          { id: 2, name: 'coach', description: 'Huấn luyện viên' },
          { id: 3, name: 'athlete', description: 'Vận động viên' }
        ]);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user
        const response = await axiosClient.put(`/users/${editingUser.id}`, formData);
        console.log('User updated:', response.data);
        setUsers(users.map(u => 
          u.id === editingUser.id ? { ...u, ...response.data } : u
        ));
      } else {
        // Create new user
                  const response = await axiosClient.post('/users', formData);
        console.log('User created:', response.data);
        setUsers([...users, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Có lỗi xảy ra khi lưu người dùng');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      user_name: user.user_name,
      email: user.email,
      password: '',
      avatar: user.avatar || '',
      is_active: user.is_active,
      roles: user.roles || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await axiosClient.delete(`/users/${id}`);
        console.log('User deleted:', id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Có lỗi xảy ra khi xóa người dùng');
      }
    }
  };

  const handleRoleChange = (roleName, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        roles: [...formData.roles, roleName]
      });
    } else {
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r !== roleName)
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      user_name: '',
      email: '',
      password: '',
      avatar: '',
      is_active: true,
      roles: []
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'coach': return 'bg-blue-100 text-blue-800';
      case 'athlete': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'coach': return 'Huấn luyện viên';
      case 'athlete': return 'Vận động viên';
      default: return role;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
            <p className="text-gray-600">Quản lý tài khoản người dùng hệ thống</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Thêm Người dùng
          </Button>
        </div>

        {/* Users List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danh sách Người dùng</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số đội
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          {user.avatar ? (
                            <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.user_name} />
                          ) : (
                            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {user.roles.map((role, index) => (
                          <span key={index} className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}>
                            {getRoleText(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.is_active ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.teams_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.created_at}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Sửa Người dùng' : 'Thêm Người dùng'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Tên người dùng"
                value={formData.user_name}
                onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {!editingUser && (
              <Input
                label="Mật khẩu"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingUser}
              />
            )}

            <Input
              label="Avatar URL"
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              placeholder="https://example.com/avatar.jpg"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <label key={role.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.name)}
                      onChange={(e) => handleRoleChange(role.name, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">{role.description}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-900">Tài khoản hoạt động</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingUser ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 