import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { CalendarToday, Schedule, CheckCircle, Add, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientAppointments } from '../../reducer/patientSlice';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.patient);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        await dispatch(fetchPatientAppointments()).unwrap();
      } catch (error) {
        if (error === 'Patient profile not found') {
          navigate('/patient/profile-setup');
        }
      }
    };
    loadAppointments();
  }, [dispatch, navigate]);

  const upcomingAppointments = appointments.filter(app => app.status === 'Booked').length;
  const completedAppointments = appointments.filter(app => app.status === 'Visited').length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Patient Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Total Appointments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {appointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                Upcoming
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {upcomingAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                Completed
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {completedAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Add sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Book Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Find available doctors and book your appointment
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/patient/book-appointment')}
                fullWidth
                sx={{ borderRadius: 2, color : 'black' }}
              >
                Book New Appointment
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Visibility sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                My Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View your appointment history and status
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/patient/appointments')}
                fullWidth
                sx={{ borderRadius: 2, color : 'black' }}
              >
                View Appointments
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;