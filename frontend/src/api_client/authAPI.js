import apiClient from './apiClient';

export const authAPI = {
  login: async (username, password) => {
    const response = await apiClient.post('/login/', { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/signup/', userData);
    return response.data;
  },
};