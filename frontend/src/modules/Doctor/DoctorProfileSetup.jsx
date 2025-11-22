import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createDoctorProfile, clearError } from '../../reducer/doctorSlice';
import ErrorAlert from '../../components/Common/ErrorAlert';
import SuccessAlert from '../../components/Common/SuccessAlert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const DoctorProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: ''
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.doctor);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createDoctorProfile(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 2000);
    } catch (err) {
      // Error handled by Redux
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Complete Your Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Please provide your specialization to complete your doctor profile
          </Typography>
          
          <ErrorAlert error={error} onClose={() => dispatch(clearError())} />
          <SuccessAlert 
            message={success ? "Profile created successfully! Redirecting to dashboard..." : null} 
            onClose={() => setSuccess(false)} 
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="e.g., Cardiology, Dermatology, Pediatrics"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !formData.name.trim() || !formData.specialization.trim()}
            >
              Complete Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DoctorProfileSetup;