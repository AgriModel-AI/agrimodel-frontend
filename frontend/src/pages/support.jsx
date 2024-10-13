import React, { useState } from 'react';
import { CssBaseline } from '@mui/material';
import { SideBar } from '../components/sidebar';
import Header from '../components/header';


import {
    Box, Typography
  } from '@mui/material';
import FilterComponent from '../components/support/FilterComponent';
import ReportList from '../components/support/ReportList';


function SupportPage
() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <SideBar 
      />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Header/>
        <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 5, py: 2, px: '20%' }}>
          <Box sx={{}}>
            <Typography variant='overline'>Filter</Typography>
            <FilterComponent />
          </Box>
          <ReportList />
        </Box>
      </Box>
    </Box>
  );
}

export default SupportPage
;
