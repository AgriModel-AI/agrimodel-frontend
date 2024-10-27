import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { SideBar } from '../components/sidebar';
import Header from '../components/header';
import Users from '../components/users';
function UsersRegisteredPage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <SideBar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Header/>
      
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 0 }}>
          {
           <Users/>
          }
        </Box>
      </Box>
    </Box>
  );
}

export default UsersRegisteredPage;
