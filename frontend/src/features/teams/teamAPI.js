import axiosInstance from '../../services/axiosClient';

// Lấy tất cả teams
export const getAllTeams = () => axiosInstance.get('/teams');

// Lấy team theo ID
export const getTeamById = (id) => axiosInstance.get(`/teams/${id}`);

// Tạo team mới
export const createTeam = (data) => axiosInstance.post('/teams', data);

// Cập nhật team
export const updateTeam = (id, data) => axiosInstance.put(`/teams/${id}`, data);

// Xóa team
export const deleteTeam = (id) => axiosInstance.delete(`/teams/${id}`);

// Lấy members của team
export const getTeamMembers = (id) => axiosInstance.get(`/teams/${id}/members`);

// Thêm member vào team
export const addTeamMember = (teamId, memberId) => axiosInstance.post(`/teams/${teamId}/members`, { member_id: memberId });

// Xóa member khỏi team
export const removeTeamMember = (teamId, memberId) => axiosInstance.delete(`/teams/${teamId}/members/${memberId}`);

// Cập nhật trạng thái team
export const updateTeamStatus = (id, status) => axiosInstance.patch(`/teams/${id}/status`, { status }); 