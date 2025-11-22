import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../api_client/appointmentAPI';

export const fetchAvailableSlots = createAsyncThunk(
  'appointment/fetchSlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.getAvailableSlots();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch slots');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/book',
  async (slotId, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.bookAppointment(slotId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to book appointment');
    }
  }
);

export const fetchAllAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.getAllAppointments();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointment/updateStatus',
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const response = await appointmentAPI.updateStatus(appointmentId, status);
      return { appointmentId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update status');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState: {
    availableSlots: [],
    allAppointments: [],
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
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.availableSlots = action.payload;
      })
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.allAppointments = action.payload;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const { appointmentId, status } = action.payload;
        const appointment = state.allAppointments.find(app => app.id === appointmentId);
        if (appointment) {
          appointment.status = status;
        }
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;