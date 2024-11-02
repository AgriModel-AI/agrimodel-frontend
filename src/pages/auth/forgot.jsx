import React from 'react';
import { Box } from '@chakra-ui/react';
import ForgotPassword from '../../components/auth/forgotPassword';

function ForgotPass() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <ForgotPassword/>
    </Box>
  );
}

export default ForgotPass;
