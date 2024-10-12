import React from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import { SideBar } from '../components/sidebar';
import Header from '../components/header';

function Dashboard() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <SideBar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
     
      
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
           <Header/>
          }
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
