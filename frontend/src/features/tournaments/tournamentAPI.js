import axiosInstance from '../../services/axios';

// Lấy tất cả tournaments
export const getAllTournaments = () => axiosInstance.get('/tournaments');

// Lấy tournament theo ID
export const getTournamentById = (id) => axiosInstance.get(`/tournaments/${id}`);

// Tạo tournament mới
export const createTournament = (data) => axiosInstance.post('/tournaments', data);

// Cập nhật tournament
export const updateTournament = (id, data) => axiosInstance.put(`/tournaments/${id}`, data);

// Xóa tournament
export const deleteTournament = (id) => axiosInstance.delete(`/tournaments/${id}`);

// Lấy matches của tournament
export const getTournamentMatches = (id) => axiosInstance.get(`/tournaments/${id}/matches`);

// Lấy teams của tournament
export const getTournamentTeams = (id) => axiosInstance.get(`/tournaments/${id}/teams`);



// Cập nhật trạng thái tournament
export const updateTournamentStatus = (id, status) => axiosInstance.patch(`/tournaments/${id}/status`, { status }); 