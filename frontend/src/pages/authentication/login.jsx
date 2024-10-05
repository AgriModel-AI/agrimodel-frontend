import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Login from '../../components/login&signup/login';

function Signin() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Login/>
    </Box>
  );
}

export default Signin;
