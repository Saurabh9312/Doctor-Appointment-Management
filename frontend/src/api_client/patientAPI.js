import apiClient from './apiClient';

export const patientAPI = {
  getAppointments: async () => {
    const response = await apiClient.get('/patient/appointments/');
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await apiClient.post(`/appointments/${appointmentId}/cancel/`);
    return response.data;
  },
};