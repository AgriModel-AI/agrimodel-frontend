import React from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';

function WelcomePage
() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
     
      
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
           <Typography>Welcome</Typography>
          }
        </Box>
      </Box>
    </Box>
  );
}

export default WelcomePage
;
