import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../api_client/adminAPI';

// Doctors
export const adminFetchDoctors = createAsyncThunk('admin/fetchDoctors', async (_, { rejectWithValue }) => {
  try {
    return await adminAPI.listDoctors();
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch doctors');
  }
});
export const adminCreateDoctor = createAsyncThunk('admin/createDoctor', async (payload, { rejectWithValue }) => {
  try {
    return await adminAPI.createDoctorProfile(payload);
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to create doctor');
  }
});
export const adminUpdateDoctor = createAsyncThunk('admin/updateDoctor', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await adminAPI.updateDoctor(id, data);
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to update doctor');
  }
});
export const adminDeleteDoctor = createAsyncThunk('admin/deleteDoctor', async (id, { rejectWithValue }) => {
  try {
    await adminAPI.deleteDoctor(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to delete doctor');
  }
});

// Patients
export const adminFetchPatients = createAsyncThunk('admin/fetchPatients', async (_, { rejectWithValue }) => {
  try {
    return await adminAPI.listPatients();
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch patients');
  }
});
export const adminCreatePatient = createAsyncThunk('admin/createPatient', async (payload, { rejectWithValue }) => {
  try {
    return await adminAPI.createPatientProfile(payload);
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to create patient');
  }
});
export const adminUpdatePatient = createAsyncThunk('admin/updatePatient', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await adminAPI.updatePatient(id, data);
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to update patient');
  }
});
export const adminDeletePatient = createAsyncThunk('admin/deletePatient', async (id, { rejectWithValue }) => {
  try {
    await adminAPI.deletePatient(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to delete patient');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    doctors: [],
    patients: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Doctors
      .addCase(adminFetchDoctors.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(adminFetchDoctors.fulfilled, (state, action) => { state.isLoading = false; state.doctors = action.payload; })
      .addCase(adminFetchDoctors.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(adminCreateDoctor.fulfilled, (state, action) => { state.doctors.push(action.payload); })
      .addCase(adminUpdateDoctor.fulfilled, (state, action) => {
        const idx = state.doctors.findIndex(d => d.id === action.payload.id);
        if (idx !== -1) state.doctors[idx] = action.payload;
      })
      .addCase(adminDeleteDoctor.fulfilled, (state, action) => { state.doctors = state.doctors.filter(d => d.id !== action.payload); })
      // Patients
      .addCase(adminFetchPatients.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(adminFetchPatients.fulfilled, (state, action) => { state.isLoading = false; state.patients = action.payload; })
      .addCase(adminFetchPatients.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(adminCreatePatient.fulfilled, (state, action) => { state.patients.push(action.payload); })
      .addCase(adminUpdatePatient.fulfilled, (state, action) => {
        const idx = state.patients.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.patients[idx] = action.payload;
      })
      .addCase(adminDeletePatient.fulfilled, (state, action) => { state.patients = state.patients.filter(p => p.id !== action.payload); });
  }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
