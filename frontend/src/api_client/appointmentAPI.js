import apiClient from './apiClient';

export const appointmentAPI = {
  getAvailableSlots: async () => {
    const response = await apiClient.get('/slots/');
    return response.data;
  },

  bookAppointment: async (slotId) => {
    const response = await apiClient.post('/appointments/book/', { slot_id: slotId });
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await apiClient.get('/admin/appointments/');
    return response.data;
  },

  updateStatus: async (appointmentId, status) => {
    const response = await apiClient.patch(`/appointments/${appointmentId}/status/`, { status });
    return response.data;
  },
};