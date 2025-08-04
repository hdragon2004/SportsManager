import axiosInstance from '../../services/axios';

// Lấy tất cả matches
export const getAllMatches = () => axiosInstance.get('/matches');

// Lấy match theo ID
export const getMatchById = (id) => axiosInstance.get(`/matches/${id}`);

// Tạo match mới
export const createMatch = (data) => axiosInstance.post('/matches', data);

// Cập nhật match
export const updateMatch = (id, data) => axiosInstance.put(`/matches/${id}`, data);

// Xóa match
export const deleteMatch = (id) => axiosInstance.delete(`/matches/${id}`);

// Cập nhật kết quả match
export const updateMatchResult = (id, result) => axiosInstance.patch(`/matches/${id}/result`, result);

// Cập nhật trạng thái match
export const updateMatchStatus = (id, status) => axiosInstance.patch(`/matches/${id}/status`, { status });

// Lấy matches theo tournament
export const getMatchesByTournament = (tournamentId) => axiosInstance.get(`/matches?tournament_id=${tournamentId}`);

// Lấy matches theo team
export const getMatchesByTeam = (teamId) => axiosInstance.get(`/matches?team_id=${teamId}`); 