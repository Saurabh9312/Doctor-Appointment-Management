import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const ErrorAlert = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert severity="error" onClose={onClose} sx={{ mb: 2 }}>
      <AlertTitle>Error</AlertTitle>
      {typeof error === 'string' ? error : JSON.stringify(error)}
    </Alert>
  );
};

export default ErrorAlert;