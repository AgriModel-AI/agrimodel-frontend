import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const notificationsData = [
  { id: 1, title: "New Message", message: "You have received a new message.", timestamp: "10 mins ago" },
  { id: 2, title: "Profile Update", message: "Your profile has been updated successfully.", timestamp: "1 hr ago" },
  { id: 3, title: "New Comment", message: "Someone commented on your post.", timestamp: "3 hrs ago" },
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
        borderRadius: '10px',
        boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" sx={{ fontSize: '1rem', color: 'black', fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      <IconButton onClick={handleClick} sx={{ color: 'black', position: 'relative' }}>
        <NotificationsNoneOutlinedIcon sx={{ fontSize: '24px' }} />
        {/* Custom notification count display */}
        {notificationsData.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4.3,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.55rem', // Adjust the font size
            }}
          >
            {notificationsData.length}
          </Box>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '300px',
            padding: '1px 8px',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
            mt: 0.6,
            ml: -3,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1px 2px',
          }}
        >
          <Typography
            sx={{
              fontWeight: 'bold',
              color: 'black',
              fontSize: '0.80rem',
            }}
          >
            Notifications
          </Typography>

          <IconButton
            size="small"
            onClick={handleClose}
            sx={{ color: '#999' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {notificationsData.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleClose}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              ml: -1,
              gap: 1,
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <PersonIcon sx={{ color: 'primary.main', fontSize: 16 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 'semibold', color: 'black', fontSize: '0.65rem' }}>
                {notification.title}
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '0.65rem' }}>
                {notification.message}
              </Typography>
              <Typography sx={{ color: '#999', fontSize: '0.55rem' }}>
                {notification.timestamp}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        {notificationsData.length === 0 && (
          <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', padding: 2 }}>
            No notifications
          </Typography>
        )}
      </Menu>
    </Box>
  );
};

export default Header;
