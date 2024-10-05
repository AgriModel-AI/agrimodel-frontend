import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import VerificationCode from '../../components/login&signup/verificationCode';

function CodeVerification() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <VerificationCode/>
    </Box>
  );
}

export default CodeVerification;
