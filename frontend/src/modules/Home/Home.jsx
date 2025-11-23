import React from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Container, Chip } from '@mui/material';
import { PersonAdd, LocalHospital, AdminPanelSettings, Schedule, Verified, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box sx={{ 
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Box 
        textAlign="center" 
        sx={{ 
          mb: 6, 
          py: 4,
          px: 2
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00bcd4 0%, #26a69a 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Doctor Appointment System
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Book appointments with qualified doctors easily and efficiently
        </Typography>
        
        {!isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register/patient')}
              sx={{ borderRadius: 2, color: 'black' }}
            >
              Signup as Patient
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register/doctor')}
              sx={{ borderRadius: 2, color : "black" }}
            >
              Signup as Doctor
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 2 }}
            >
              Login
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                For Patients
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Easy appointment booking
                • View appointment history
                • Track appointment status
                • Choose from available doctors
              </Typography>
              {!isAuthenticated && (
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => navigate('/register/patient')}
                >
                  Join as Patient
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                For Doctors
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Manage appointment slots
                • View patient appointments
                • Update appointment status
                • Flexible scheduling
              </Typography>
              {!isAuthenticated && (
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => navigate('/register/doctor')}
                >
                  Join as Doctor
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <AdminPanelSettings sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                For Administrators
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Complete appointment overview
                • Monitor system usage
                • Track appointment statistics
                • Manage system operations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;