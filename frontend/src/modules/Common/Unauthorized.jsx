import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" sx={{ mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom color="error">
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        You don't have permission to access this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  );
};

export default Unauthorized;