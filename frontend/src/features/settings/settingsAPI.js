import axiosInstance from '../../services/axios';

export const getSettings = () => axiosInstance.get('/settings');
export const updateSettings = (data) => axiosInstance.put('/settings', data);
export const getSettingsByCategory = (category) => axiosInstance.get(`/settings/${category}`);
export const updateSettingsByCategory = (category, data) => axiosInstance.put(`/settings/${category}`, data); 