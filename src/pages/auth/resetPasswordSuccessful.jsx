import React from 'react';
import { Box } from '@chakra-ui/react';
import ResetSuccessful from '../../components/auth/resetSuccessful';

function ResetPasswordSuccessful() {
  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
      <ResetSuccessful/>
    </Box>
  );
}

export default ResetPasswordSuccessful;
