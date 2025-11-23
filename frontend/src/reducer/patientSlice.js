import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { patientAPI } from '../api_client/patientAPI';

export const createPatientProfile = createAsyncThunk(
  'patient/createProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await patientAPI.createProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create profile');
    }
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  'patient/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientAPI.getAppointments();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);

export const cancelPatientAppointment = createAsyncThunk(
  'patient/cancelAppointment',
  async (appointmentId, { rejectWithValue }) => {
    try {
      await patientAPI.cancelAppointment(appointmentId);
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel appointment');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    appointments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPatientProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPatientProfile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPatientProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      .addCase(cancelPatientAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelPatientAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
      })
      .addCase(cancelPatientAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;