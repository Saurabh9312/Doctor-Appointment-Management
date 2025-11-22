import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { doctorAPI } from '../../api_client/doctorAPI';
import { appointmentAPI } from '../../api_client/appointmentAPI';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorAlert from '../../components/Common/ErrorAlert';
import SuccessAlert from '../../components/Common/SuccessAlert';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await doctorAPI.getDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error === 'Doctor profile not found') {
        navigate('/doctor/profile-setup');
      } else {
        setError('Failed to fetch appointments');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setDialogOpen(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      await appointmentAPI.updateStatus(selectedAppointment.id, newStatus);
      setSuccess(true);
      setDialogOpen(false);
      fetchAppointments();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/doctor/dashboard')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          My Appointments
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <ErrorAlert error={error} onClose={() => setError(null)} />
          <SuccessAlert 
            message={success ? "Appointment status updated successfully!" : null} 
            onClose={() => setSuccess(false)} 
          />

          {appointments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No appointments found.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patient_name}</TableCell>
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
                          variant="outlined"
                          size="small"
                          onClick={() => handleStatusUpdate(appointment)}
                          disabled={appointment.status === 'Visited'}
                        >
                          Update Status
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
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="Booked">Booked</MenuItem>
              <MenuItem value="Visited">Visited</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAppointments;