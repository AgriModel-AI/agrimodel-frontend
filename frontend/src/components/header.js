import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

// Mock JSON data for notifications
const notificationsData = [
  { id: 1, message: "You have a new message." },
  { id: 2, message: "Your profile has been updated." },
  { id: 3, message: "New comment on your post." },
];

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2px 32px',
        backgroundColor: 'white',
        borderRadius: '10px ',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" sx={{ fontSize: '1rem', color: 'black', fontWeight:'bold' }}>
        Dashboard 
      </Typography>

      <IconButton onClick={handleClick} sx={{ color: 'black' }}>
        <NotificationsNoneOutlinedIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notificationsData.map((notification) => (
          <MenuItem key={notification.id} onClick={handleClose}>
            {notification.message}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default Header;
