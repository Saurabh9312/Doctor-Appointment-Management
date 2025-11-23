import React, { useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Schedule, EventAvailable, EventBusy, Settings, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorSlots } from '../../reducer/doctorSlice';
import { doctorAPI } from '../../api_client/doctorAPI';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { slots } = useSelector((state) => state.doctor);
  const [appointments, setAppointments] = React.useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchDoctorSlots()).unwrap();
        await fetchAppointments();
      } catch (error) {
        if (error === 'Doctor profile not found') {
          navigate('/doctor/profile-setup');
        }
      }
    };
    loadData();
  }, [dispatch, navigate]);

  const fetchAppointments = async () => {
    try {
      const data = await doctorAPI.getDoctorAppointments();
      setAppointments(data);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error === 'Doctor profile not found') {
        navigate('/doctor/profile-setup');
      } else {
        console.error('Failed to fetch appointments:', error);
      }
    }
  };

  const totalSlots = slots.length;
  const bookedSlots = slots.filter(slot => slot.is_booked).length;
  const availableSlots = totalSlots - bookedSlots;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Doctor Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Total Slots
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {totalSlots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventAvailable sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                Available Slots
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {availableSlots}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <EventBusy sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                Booked Appointments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {appointments.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Slot Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create and manage your appointment slots
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/doctor/slots')}
                fullWidth
                sx={{ borderRadius: 2 , color : 'black'}}
              >
                Manage Slots
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ p: 3, textAlign: 'center' }}>
              <Visibility sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Appointments
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View and update appointment status
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/doctor/appointments')}
                fullWidth
                sx={{ borderRadius: 2, color: 'black' }}
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

export default DoctorDashboard;