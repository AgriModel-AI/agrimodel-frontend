import React from 'react';
import { Avatar, Box, Stack, Typography, IconButton } from '@mui/material';
import { Email, Phone, Home, LocationCity, CalendarToday, Badge } from '@mui/icons-material';
import { Close } from '@mui/icons-material';

function ProfileCard({ onClose }) {
  const user = {
    name: "MUHIRE Jackson Kelly",
    email: "jackson@gmail.com",
    phone: "+257 0789 470 000",
    street: "KG 48 st",
    city: "Kigali City",
    dob: "Sept 28, 1990",
    nationalId: "1199080128731005",
    joinedAt: "Jun 29, 2024"
  };

  const firstLetter = user.name.charAt(0).toUpperCase(); 

  return (
    <Box
      sx={{
        maxWidth: 800,
        padding: '25px 54px',
        bgcolor: '#f2f7fa', 
        borderRadius: '8px',
        boxShadow: 2, 
        display: 'flex',
        gap: 10,
        margin: '0 auto', 
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
    >
      {/* Profile Picture and Name */}
      <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -5, ml:5 }}>
        <Avatar
          sx={{
            width: 150,
            height: 150,
            bgcolor: 'gray', 
            mb: 1
          }}
        >
          {firstLetter} 
        </Avatar>
        <Typography variant="h8" fontWeight="bold">{user.name}</Typography>
        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        <Avatar
          sx={{
            width: 16,
            height: 16,
            bgcolor: 'primary.main',
            mt: 1,
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          ✔
        </Avatar>
      </Box>

      {/* Details Section */}
      <Box sx={{ flex: 1 }}>
        <Stack spacing={3}>
          {/* About Section */}
          <Box>
            <Typography variant="subtitle1" sx={{fontSize:'1rem', fontWeight:'bold', color:'primary.main'}}>About</Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center">
                <Email sx={{fontSize:'1rem'}}/>
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>Email: {user.email}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Phone sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>Phone number: {user.phone}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Address Section */}
          <Box>
            <Typography variant="subtitle1" sx={{fontSize:'1rem', fontWeight:'bold', color:'primary.main'}}>Address</Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center">
                <Home sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>Street: {user.street}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <LocationCity sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>City: {user.city}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Other Details Section */}
          <Box>
            <Typography variant="subtitle1" sx={{fontSize:'1rem', fontWeight:'bold', color:'primary.main'}}>Other Details</Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center">
                <CalendarToday sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>Date of Birth: {user.dob}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <Badge sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>National ID: {user.nationalId}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <CalendarToday sx={{fontSize:'1rem'}} />
                <Typography variant="body2" sx={{fontSize:'0.80rem', ml:1}}>Joined At: {user.joinedAt}</Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Close Button */}
      <Box sx={{ mt: -35, textAlign: 'right', mr: -4 }}>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: '#8b0000', 
            borderRadius: '5px', 
            color:'white',
            '&:hover': {
              bgcolor: '#ff0000', 
              color: 'white', 
            },
            padding: 0.5, 
          }}
        >
          <Close fontSize="small" /> 
        </IconButton>
      </Box>
    </Box>
  );
}

export default ProfileCard;
