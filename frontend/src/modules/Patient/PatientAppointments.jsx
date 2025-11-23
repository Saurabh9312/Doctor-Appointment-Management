import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchPatientAppointments, cancelPatientAppointment } from '../../reducer/patientSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const PatientAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments, isLoading } = useSelector((state) => state.patient);

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

   const handleCancelAppointment = async (slotId) => {
      try {
        await dispatch(cancelPatientAppointment(slotId)).unwrap();
        // Optionally refetch:
        // dispatch(fetchDoctorSlots());
      } catch (err) {
        // Error handled by Redux slice
      }
    };
  

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/patient/dashboard')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          My Appointments
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {appointments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No appointments found. Book your first appointment to get started.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.doctor_name}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.status} 
                          color={appointment.status === 'Visited' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          disabled={appointment.status !== 'Booked'}
                          onClick={() => handleCancelAppointment(appointment.id)}

                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientAppointments;