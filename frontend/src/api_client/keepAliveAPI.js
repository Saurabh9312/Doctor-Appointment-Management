import apiClient from './apiClient';

export const keepAliveAPI = {
  /**
   * Ping the backend to keep it alive
   */
  ping: async () => {
    try {
      const response = await apiClient.get('/keep-alive/');
      return response.data;
    } catch (error) {
      // Don't throw error for keep-alive - just log it
      console.warn('Keep-alive ping failed:', error.message);
      return { status: 'error', message: 'Ping failed' };
    }
  },

  /**
   * Alternative POST method for keep-alive
   */
  pingPost: async (data = {}) => {
    try {
      const response = await apiClient.post('/keep-alive/', data);
      return response.data;
    } catch (error) {
      // Don't throw error for keep-alive - just log it
      console.warn('Keep-alive ping failed:', error.message);
      return { status: 'error', message: 'Ping failed' };
    }
  }
};