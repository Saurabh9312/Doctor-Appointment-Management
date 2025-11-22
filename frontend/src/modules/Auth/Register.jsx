import React from 'react';
import { Card, CardContent, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Card sx={{ maxWidth: 400, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Choose Registration Type
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Please select how you would like to register:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/register/patient')}
            >
              Register as Patient
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/register/doctor')}
            >
              Register as Doctor
            </Button>
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Button onClick={() => navigate('/login')} variant="text">
                Already have an account? Login
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;