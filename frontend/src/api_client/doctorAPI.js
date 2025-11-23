import apiClient from './apiClient';

export const doctorAPI = {
  createProfile: async (profileData) => {
    const response = await apiClient.post('/doctor/create/', profileData);
    return response.data;
  },

  getDoctors: async () => {
    const response = await apiClient.get('/doctors/');
    return response.data;
  },

  createSlot: async (slotData) => {
    const response = await apiClient.post('/slots/create/', slotData);
    return response.data;
  },

  getDoctorSlots: async () => {
    const response = await apiClient.get('/doctor/slots/');
    return response.data;
  },

  getDoctorAppointments: async () => {
    const response = await apiClient.get('/doctor/appointments/');
    return response.data;
  },

  deleteSlot: async (slotId) => {
    const response = await apiClient.delete(`/doctor/slots/${slotId}/delete/`);
    return response.data;
  },
};