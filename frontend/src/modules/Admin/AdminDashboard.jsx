import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { CalendarToday, Schedule, CheckCircle, Delete, Edit, Add } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments } from '../../reducer/appointmentSlice';
import { adminFetchDoctors, adminFetchPatients, adminCreateDoctor, adminCreatePatient, adminUpdateDoctor, adminUpdatePatient, adminDeleteDoctor, adminDeletePatient } from '../../reducer/adminSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { allAppointments, isLoading } = useSelector((state) => state.appointment);
  const { doctors, patients } = useSelector((state) => state.admin);

  const [openDoctorDialog, setOpenDoctorDialog] = useState(false);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [doctorForm, setDoctorForm] = useState({ user_id: '', name: '', specialization: '' });
  const [patientForm, setPatientForm] = useState({ user_id: '', name: '', phone_number: '' });

  useEffect(() => {
    dispatch(fetchAllAppointments());
    dispatch(adminFetchDoctors());
    dispatch(adminFetchPatients());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;

  const totalAppointments = allAppointments.length;
  const bookedAppointments = allAppointments.filter(app => app.status === 'Booked').length;
  const visitedAppointments = allAppointments.filter(app => app.status === 'Visited').length;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
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
                {totalAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 'bold' }}>
                Booked
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {bookedAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" color="success.main" sx={{ fontWeight: 'bold' }}>
                Visited
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {visitedAppointments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            All Appointments
          </Typography>
          
          {allAppointments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No appointments found.
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.id}</TableCell>
                      <TableCell>{appointment.patient}</TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>{appointment.date}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.status} 
                          color={appointment.status === 'Visited' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Doctors Management */}
      <Card sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Manage Doctors
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingDoctor(null); setDoctorForm({ user_id: '', name: '', specialization: '' }); setOpenDoctorDialog(true); }}>Add Doctor Profile</Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.id}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell>{doc.specialization}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => { setEditingDoctor(doc); setDoctorForm({ user_id: '', name: doc.name, specialization: doc.specialization }); setOpenDoctorDialog(true); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => dispatch(adminDeleteDoctor(doc.id))}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Patients Management */}
      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Manage Patients
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingPatient(null); setPatientForm({ user_id: '', name: '', phone_number: '' }); setOpenPatientDialog(true); }}>Add Patient Profile</Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((pat) => (
                  <TableRow key={pat.id}>
                    <TableCell>{pat.id}</TableCell>
                    <TableCell>{pat.name}</TableCell>
                    <TableCell>{pat.phone_number}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => { setEditingPatient(pat); setPatientForm({ user_id: '', name: pat.name, phone_number: pat.phone_number }); setOpenPatientDialog(true); }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => dispatch(adminDeletePatient(pat.id))}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Doctor Dialog */}
      <Dialog open={openDoctorDialog} onClose={() => setOpenDoctorDialog(false)}>
        <DialogTitle>{editingDoctor ? 'Edit Doctor' : 'Create Doctor Profile'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {!editingDoctor && (
            <TextField label="User ID (existing doctor user)" value={doctorForm.user_id} onChange={(e) => setDoctorForm({ ...doctorForm, user_id: e.target.value })} />
          )}
          <TextField label="Name" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} />
          <TextField label="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDoctorDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (editingDoctor) {
              dispatch(adminUpdateDoctor({ id: editingDoctor.id, data: { name: doctorForm.name, specialization: doctorForm.specialization } }));
            } else {
              dispatch(adminCreateDoctor({ user_id: Number(doctorForm.user_id), name: doctorForm.name, specialization: doctorForm.specialization }));
            }
            setOpenDoctorDialog(false);
          }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Patient Dialog */}
      <Dialog open={openPatientDialog} onClose={() => setOpenPatientDialog(false)}>
        <DialogTitle>{editingPatient ? 'Edit Patient' : 'Create Patient Profile'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {!editingPatient && (
            <TextField label="User ID (existing patient user)" value={patientForm.user_id} onChange={(e) => setPatientForm({ ...patientForm, user_id: e.target.value })} />
          )}
          <TextField label="Name" value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} />
          <TextField label="Phone Number" value={patientForm.phone_number} onChange={(e) => setPatientForm({ ...patientForm, phone_number: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (editingPatient) {
              dispatch(adminUpdatePatient({ id: editingPatient.id, data: { name: patientForm.name, phone_number: patientForm.phone_number } }));
            } else {
              dispatch(adminCreatePatient({ user_id: Number(patientForm.user_id), name: patientForm.name, phone_number: patientForm.phone_number }));
            }
            setOpenPatientDialog(false);
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;