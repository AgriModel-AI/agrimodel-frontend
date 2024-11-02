import React from 'react';
import { Box } from '@chakra-ui/react';
import Signup from '../../components/auth/signup';

function SignUp() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <Signup/>
    </Box>
  );
}

export default SignUp;
