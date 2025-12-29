import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';

import keepAliveService from './services/keepAliveService';

import store from './store';
import Layout from './components/Layout/Layout';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import ChatWidget from './components/ChatWidget';

// Public pages
import Home from './modules/Home/Home';
import Login from './modules/Auth/Login';
import Register from './modules/Auth/Register';
import PatientSignup from './modules/Auth/PatientSignup';
import DoctorSignup from './modules/Auth/DoctorSignup';
import Unauthorized from './modules/Common/Unauthorized';

// Doctor module pages
import DoctorDashboard from './modules/Doctor/DoctorDashboard';
import SlotManagement from './modules/Doctor/SlotManagement';
import DoctorAppointments from './modules/Doctor/DoctorAppointments';

// Patient module pages
import PatientDashboard from './modules/Patient/PatientDashboard';
import BookAppointment from './modules/Patient/BookAppointment';
import PatientAppointments from './modules/Patient/PatientAppointments';

// Admin module pages
import AdminDashboard from './modules/Admin/AdminDashboard';

// Custom Material-UI theme configuration
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
      contrastText: '#fff',
    },
    secondary: {
      main: '#26a69a',
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#fff',
    },
    success: {
      main: '#66bb6a',
      light: '#98ee99',
      dark: '#338a3e',
    },
    warning: {
      main: '#ffa726',
      light: '#ffd95b',
      dark: '#c77800',
    },
    background: {
      default: '#0a1929',
      paper: '#1e2a38',
    },
    text: {
      primary: '#e3f2fd',
      secondary: '#b0bec5',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, color: '#e3f2fd' },
    h6: { fontWeight: 600, color: '#e3f2fd' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    // Button component customization
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 188, 212, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00bcd4 0%, #26a69a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #008ba3 0%, #00766c 100%)',
          },
        },
      },
    },
    // Card component customization
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e2a38',
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid rgba(0, 188, 212, 0.15)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 188, 212, 0.25)',
            transform: 'translateY(-4px)',
            borderColor: 'rgba(0, 188, 212, 0.3)',
          },
        },
      },
    },
    // TextField component customization
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 188, 212, 0.05)',
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#00bcd4',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00bcd4',
            },
          },
        },
      },
    },
    // Paper component customization
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1e2a38',
        },
      },
    },
    // AppBar customization
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const App = () => {
  useEffect(() => {
    // Start the keep-alive service when the app mounts
    keepAliveService.start();
    
    // Cleanup function to stop the service when the app unmounts
    return () => {
      keepAliveService.stop();
    };
  }, []);
  
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/register/patient" element={<PublicRoute><PatientSignup /></PublicRoute>} />
              <Route path="/register/doctor" element={<PublicRoute><DoctorSignup /></PublicRoute>} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </PrivateRoute>
              } />
              <Route path="/doctor/slots" element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <SlotManagement />
                </PrivateRoute>
              } />
              <Route path="/doctor/appointments" element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorAppointments />
                </PrivateRoute>
              } />

              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </PrivateRoute>
              } />
              <Route path="/patient/book-appointment" element={
                <PrivateRoute allowedRoles={['patient']}>
                  <BookAppointment />
                </PrivateRoute>
              } />
              <Route path="/patient/appointments" element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PatientAppointments />
                </PrivateRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </Layout>
          <ChatWidget />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
