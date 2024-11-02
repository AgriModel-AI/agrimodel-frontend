import React from 'react';
import { Box } from '@chakra-ui/react';
import ResetPassword from '../../components/auth/resetPassword';

function Resetpassword() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <ResetPassword/>
    </Box>
  );
}

export default Resetpassword;
