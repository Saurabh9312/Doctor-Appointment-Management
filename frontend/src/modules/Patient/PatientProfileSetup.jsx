import React, { useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPatientProfile, clearError } from '../../reducer/patientSlice';
import ErrorAlert from '../../components/Common/ErrorAlert';
import SuccessAlert from '../../components/Common/SuccessAlert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PatientProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: ''
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.patient);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPatientProfile(formData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate('/patient/dashboard');
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
            Please provide your phone number to complete your patient profile
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
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              margin="normal"
              required
              placeholder="e.g., +1234567890"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || !formData.name.trim() || !formData.phone_number.trim()}
            >
              Complete Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientProfileSetup;