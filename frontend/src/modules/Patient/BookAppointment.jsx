import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAvailableSlots, bookAppointment, clearError } from '../../reducer/appointmentSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';
import SuccessAlert from '../../components/Common/SuccessAlert';

const BookAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availableSlots, isLoading, error } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(fetchAvailableSlots());
  }, [dispatch]);

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setDialogOpen(true);
  };

  const confirmBooking = async () => {
    try {
      await dispatch(bookAppointment(selectedSlot.id)).unwrap();
      setSuccess(true);
      setDialogOpen(false);
      dispatch(fetchAvailableSlots()); // Refresh slots
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setDialogOpen(false);
      if (err.includes('Patient profile not found')) {
        navigate('/patient/profile-setup');
      }
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
          Book Appointment
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Available Slots
          </Typography>
          
          <ErrorAlert error={error} onClose={() => dispatch(clearError())} />
          <SuccessAlert 
            message={success ? "Appointment booked successfully!" : null} 
            onClose={() => setSuccess(false)} 
          />

          {availableSlots.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No available slots at the moment. Please check back later.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{slot.doctor_name}</TableCell>
                      <TableCell>{slot.specialization}</TableCell>
                      <TableCell>{slot.date}</TableCell>
                      <TableCell>{slot.start_time}</TableCell>
                      <TableCell>{slot.end_time}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          sx = {{color : 'black'}}
                          onClick={() => handleBookSlot(slot)}
                        >
                          Book
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          {selectedSlot && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to book this appointment?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Doctor:</strong> {selectedSlot.doctor_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Specialization:</strong> {selectedSlot.specialization}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Date:</strong> {selectedSlot.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Time:</strong> {selectedSlot.start_time} - {selectedSlot.end_time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmBooking} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookAppointment;