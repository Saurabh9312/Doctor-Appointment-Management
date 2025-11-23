import apiClient from './apiClient';

export const patientAPI = {
  createProfile: async (profileData) => {
    const response = await apiClient.post('/patient/create/', profileData);
    return response.data;
  },

  getAppointments: async () => {
    const response = await apiClient.get('/patient/appointments/');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/cancel/`);
    return response.data;
  },
};