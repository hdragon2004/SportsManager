import axiosInstance from '../../services/axiosClient';

// Lấy tất cả registrations
export const getAllRegistrations = () => axiosInstance.get('/registrations');

// Lấy registration theo ID
export const getRegistrationById = (id) => axiosInstance.get(`/registrations/${id}`);

// Tạo registration mới
export const createRegistration = (data) => axiosInstance.post('/registrations', data);

// Cập nhật registration
export const updateRegistration = (id, data) => axiosInstance.put(`/registrations/${id}`, data);

// Xóa registration
export const deleteRegistration = (id) => axiosInstance.delete(`/registrations/${id}`);

// Cập nhật trạng thái registration
export const updateRegistrationStatus = (id, status) => axiosInstance.patch(`/registrations/${id}/status`, { status });

// Lấy registrations theo tournament
export const getRegistrationsByTournament = (tournamentId) => axiosInstance.get(`/registrations?tournament_id=${tournamentId}`);

// Lấy registrations theo team
export const getRegistrationsByTeam = (teamId) => axiosInstance.get(`/registrations?team_id=${teamId}`);

// Duyệt registration
export const approveRegistration = (id) => axiosInstance.patch(`/registrations/${id}/approve`);

// Từ chối registration
export const rejectRegistration = (id, reason) => axiosInstance.patch(`/registrations/${id}/reject`, { reason }); 