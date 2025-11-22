import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducer/authSlice';
import doctorReducer from '../reducer/doctorSlice';
import patientReducer from '../reducer/patientSlice';
import appointmentReducer from '../reducer/appointmentSlice';
import adminReducer from '../reducer/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    patient: patientReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
  },
});

export default store;