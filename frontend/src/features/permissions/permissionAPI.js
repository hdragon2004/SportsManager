import axiosClient from '../../services/axiosClient';

// Lấy tất cả yêu cầu quyền
export const getAllPermissions = async () => {
  try {
    const response = await axiosClient.get('/role-users');
    return response;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

// Lấy yêu cầu quyền theo ID
export const getPermissionById = async (id) => {
  try {
    const response = await axiosClient.get(`/role-users/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching permission:', error);
    throw error;
  }
};

// Cập nhật trạng thái yêu cầu quyền (duyệt/từ chối)
export const updatePermissionStatus = async (id, data) => {
  try {
    const response = await axiosClient.put(`/role-users/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating permission status:', error);
    throw error;
  }
};

// Xóa yêu cầu quyền
export const deletePermission = async (id) => {
  try {
    const response = await axiosClient.delete(`/role-users/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

// User xin quyền huấn luyện viên
export const requestCoachRole = async (reason) => {
  try {
    const response = await axiosClient.post('/request-coach-role', { reason });
    return response;
  } catch (error) {
    console.error('Error requesting coach role:', error);
    throw error;
  }
};

// Lấy danh sách roles
export const getAllRoles = async () => {
  try {
    const response = await axiosClient.get('/roles');
    return response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}; 