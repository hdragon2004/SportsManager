import axiosInstance from '../../services/axiosClient';

// Đăng nhập
export const login = (data) => axiosInstance.post('/auth/login', data);

// Đăng ký
export const register = (data) => axiosInstance.post('/auth/register', data);

// Đăng xuất
export const logout = () => axiosInstance.post('/auth/logout');

// Refresh token
export const refreshToken = () => axiosInstance.post('/auth/refresh');

// Lấy thông tin user hiện tại
export const getCurrentUser = () => axiosInstance.get('/auth/me');

// Đổi mật khẩu
export const changePassword = (data) => axiosInstance.post('/auth/change-password', data);

// Quên mật khẩu
export const forgotPassword = (email) => axiosInstance.post('/auth/forgot-password', { email });

// Reset mật khẩu
export const resetPassword = (token, password) => axiosInstance.post('/auth/reset-password', { token, password }); 