import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import ResetSuccessful from '../../components/login&signup/resetSuccessful';

function ResetPasswordSuccessful() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <ResetSuccessful/>
    </Box>
  );
}

export default ResetPasswordSuccessful;
