import apiClient from './apiClient';

export const adminAPI = {
  // Doctors
  listDoctors: async () => {
    const res = await apiClient.get('/admin/doctors/');
    return res.data;
  },
  createDoctorProfile: async (payload) => {
    // { user_id, name, specialization }
    const res = await apiClient.post('/admin/doctors/', payload);
    return res.data;
  },
  updateDoctor: async (doctorId, payload) => {
    const res = await apiClient.patch(`/admin/doctors/${doctorId}/`, payload);
    return res.data;
  },
  deleteDoctor: async (doctorId) => {
    const res = await apiClient.delete(`/admin/doctors/${doctorId}/`);
    return res.status;
  },

  // Patients
  listPatients: async () => {
    const res = await apiClient.get('/admin/patients/');
    return res.data;
  },
  createPatientProfile: async (payload) => {
    // { user_id, name, phone_number }
    const res = await apiClient.post('/admin/patients/', payload);
    return res.data;
  },
  updatePatient: async (patientId, payload) => {
    const res = await apiClient.patch(`/admin/patients/${patientId}/`, payload);
    return res.data;
  },
  deletePatient: async (patientId) => {
    const res = await apiClient.delete(`/admin/patients/${patientId}/`);
    return res.status;
  },
};
