import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../../reducer/authSlice';
import ErrorAlert from '../../components/Common/ErrorAlert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    email: '',
    password: '',
    password_confirm: '',
    role: 'patient',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      switch (role) {
        case 'doctor':
          navigate('/doctor/profile-setup');
          break;
        case 'patient':
          navigate('/patient/profile-setup');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      return;
    }
    dispatch(registerUser(formData));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Patient Signup
          </Typography>
          
          <ErrorAlert error={error} onClose={() => dispatch(clearError())} />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Full Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              margin="normal"
              required
              error={formData.password !== formData.password_confirm && formData.password_confirm !== ''}
              helperText={formData.password !== formData.password_confirm && formData.password_confirm !== '' ? "Passwords don't match" : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || formData.password !== formData.password_confirm}
            >
              Register as Patient
            </Button>
            <Box textAlign="center">
              <Button onClick={() => navigate('/login')} variant="text">
                Already have an account? Login
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: 1 }}>
              <Button onClick={() => navigate('/register/doctor')} variant="text">
                Are you a doctor? Register here
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientSignup;