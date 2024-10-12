import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { SideBar } from '../components/sidebar';
import Header from '../components/header';
function DiseasePage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <SideBar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Header/>
      
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
          
          }
        </Box>
      </Box>
    </Box>
  );
}

export default DiseasePage;
