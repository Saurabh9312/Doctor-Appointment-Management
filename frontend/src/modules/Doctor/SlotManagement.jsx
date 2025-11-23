import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSlot, fetchDoctorSlots, clearError, deleteDoctorSlot } from '../../reducer/doctorSlice';
import ErrorAlert from '../../components/Common/ErrorAlert';
import SuccessAlert from '../../components/Common/SuccessAlert';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const SlotManagement = () => {
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: '',
  });
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slots, isLoading, error } = useSelector((state) => state.doctor);

  useEffect(() => {
    const loadSlots = async () => {
      try {
        await dispatch(fetchDoctorSlots()).unwrap();
      } catch (error) {
        if (error === 'Doctor profile not found') {
          navigate('/doctor/profile-setup');
        }
      }
    };
    loadSlots();
  }, [dispatch, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSlot(formData)).unwrap();
      setSuccess(true);
      setFormData({ date: '', start_time: '', end_time: '' });
      dispatch(fetchDoctorSlots());
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await dispatch(deleteDoctorSlot(slotId)).unwrap();
      // Optionally refetch:
      // dispatch(fetchDoctorSlots());
    } catch (err) {
      // Error handled by Redux slice
    }
  };

  if (isLoading && slots.length === 0) return <LoadingSpinner />;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/doctor/dashboard')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0 }}>
          Slot Management
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Create New Slot
          </Typography>

          <ErrorAlert error={error} onClose={() => dispatch(clearError())} />
          <SuccessAlert
            message={success ? 'Slot created successfully!' : null}
            onClose={() => setSuccess(false)}
          />

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Start Time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="End Time"
                name="end_time"
                type="time"
                value={formData.end_time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{ minWidth: 150 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 120, color : "black" }}
              >
                Create Slot
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Slots
          </Typography>

          {slots.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No slots created yet. Create your first slot above.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{slot.date}</TableCell>
                      <TableCell>{slot.start_time}</TableCell>
                      <TableCell>{slot.end_time}</TableCell>
                      <TableCell>
                        <Chip
                          label={slot.is_booked ? 'Booked' : 'Available'}
                          color={slot.is_booked ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          disabled={slot.is_booked || isLoading}
                          onClick={() => handleDeleteSlot(slot.id)}
                        >
                          Delete
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

export default SlotManagement;