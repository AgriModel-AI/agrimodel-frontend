import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import ForgotPassword from '../../components/login&signup/forgotPassword';

function ForgotPass() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <ForgotPassword/>
    </Box>
  );
}

export default ForgotPass;
