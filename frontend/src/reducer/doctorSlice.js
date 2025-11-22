import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorAPI } from '../api_client/doctorAPI';

export const createDoctorProfile = createAsyncThunk(
  'doctor/createProfile',
  async (specialization, { rejectWithValue }) => {
    try {
      const response = await doctorAPI.createProfile(specialization);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create profile');
    }
  }
);

export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorAPI.getDoctors();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch doctors');
    }
  }
);

export const createSlot = createAsyncThunk(
  'doctor/createSlot',
  async (slotData, { rejectWithValue }) => {
    try {
      const response = await doctorAPI.createSlot(slotData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create slot');
    }
  }
);

export const fetchDoctorSlots = createAsyncThunk(
  'doctor/fetchSlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorAPI.getDoctorSlots();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch slots');
    }
  }
);

const doctorSlice = createSlice({
  name: 'doctor',
  initialState: {
    doctors: [],
    slots: [],
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
      .addCase(createDoctorProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDoctorProfile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createDoctorProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
      })
      .addCase(createSlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSlot.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDoctorSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
      });
  },
});

export const { clearError } = doctorSlice.actions;
export default doctorSlice.reducer;