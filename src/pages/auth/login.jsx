import React from 'react';
import { Box } from '@chakra-ui/react';
import Login from '../../components/auth/login';

function Signin() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <Login />
    </Box>
  );
}

export default Signin;
