import axiosInstance from '../../services/axios';

// Lấy thống kê tổng quan
export const getDashboardStats = () => axiosInstance.get('/statistics/dashboard');

// Lấy thống kê tournaments
export const getTournamentStats = () => axiosInstance.get('/statistics/tournaments');

// Lấy thống kê teams
export const getTeamStats = () => axiosInstance.get('/statistics/teams');

// Lấy thống kê users
export const getUserStats = () => axiosInstance.get('/statistics/users');

// Lấy thống kê matches
export const getMatchStats = () => axiosInstance.get('/statistics/matches');

// Lấy top teams
export const getTopTeams = (limit = 10) => axiosInstance.get(`/statistics/top-teams?limit=${limit}`);

// Lấy recent matches
export const getRecentMatches = (limit = 5) => axiosInstance.get(`/statistics/recent-matches?limit=${limit}`);

// Lấy thống kê theo thời gian
export const getStatsByDateRange = (startDate, endDate) => axiosInstance.get(`/statistics/by-date?start=${startDate}&end=${endDate}`);

// Lấy thống kê theo tournament
export const getStatsByTournament = (tournamentId) => axiosInstance.get(`/statistics/tournament/${tournamentId}`);

// Lấy thống kê theo team
export const getStatsByTeam = (teamId) => axiosInstance.get(`/statistics/team/${teamId}`); 