import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Signup from '../../components/login&signup/signup';

function SignUp() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Signup/>
    </Box>
  );
}

export default SignUp;
