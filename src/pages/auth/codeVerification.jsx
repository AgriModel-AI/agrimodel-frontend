import React from 'react';
import { Box } from '@chakra-ui/react';
import VerificationCode from '../../components/auth/verificationCode';

function CodeVerification() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <VerificationCode/>
    </Box>
  );
}

export default CodeVerification;