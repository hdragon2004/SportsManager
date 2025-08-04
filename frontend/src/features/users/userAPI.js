import axiosInstance from '../../services/axiosClient';

// Lấy tất cả users
export const getAllUsers = () => axiosInstance.get('/users');

// Lấy user theo ID
export const getUserById = (id) => axiosInstance.get(`/users/${id}`);

// Tìm kiếm users
export const searchUsers = (query) => axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`);

// Cập nhật user
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);

// Xóa user
export const deleteUser = (id) => axiosInstance.delete(`/users/${id}`);

// Cập nhật trạng thái user
export const updateUserStatus = (id, status) => axiosInstance.patch(`/users/${id}/status`, { status });

// Cập nhật role của user
export const updateUserRole = (id, role) => axiosInstance.patch(`/users/${id}/role`, { role }); 