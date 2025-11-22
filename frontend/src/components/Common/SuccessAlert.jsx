import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert severity="success" onClose={onClose} sx={{ mb: 2 }}>
      <AlertTitle>Success</AlertTitle>
      {message}
    </Alert>
  );
};

export default SuccessAlert;