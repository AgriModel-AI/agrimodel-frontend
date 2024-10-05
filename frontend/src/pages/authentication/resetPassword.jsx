import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import ResetPassword from '../../components/login&signup/resetPassword';

function Resetpassword() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <ResetPassword/>
    </Box>
  );
}

export default Resetpassword;
