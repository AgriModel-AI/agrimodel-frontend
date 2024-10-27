import React, { useState } from 'react';

import {
    Card,
    CardContent,
    Avatar,
    Typography,
    Box,
    IconButton,
    Stack,
    Menu,
    MenuItem,
    Modal,
    TextField,
    Button,
  } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CircleIcon from '@mui/icons-material/Circle';

const ReportCard = ({ title, description, date, status, onStatusChange }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
  
    const handleMenuClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleStatusChange = (newStatus) => {
      if (newStatus === 'Closed') {
        setOpenModal(true); // Open the modal for description input
      } else {
        onStatusChange(newStatus);
      }
      handleMenuClose();
    };
  
    const handleModalClose = () => {
      setOpenModal(false);
    };
  
    const handleSubmit = () => {
      // Handle submission logic (e.g., call a function to update status)
      onStatusChange('Closed', { title: modalTitle, description: modalDescription });
      setModalTitle('');
      setModalDescription('');
      handleModalClose();
    };
  
    return (
      <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',padding: '15px 20px 15px 20px', marginBottom: '16px', borderRadius: '12px', boxShadow: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginRight: 3}}>
            <Avatar
                src="https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg?t=st=1728759547~exp=1728763147~hmac=6f4846ab7a3a618d83c3c83b11dd7a5b2edb9a63abf756bccff52706c9964fb0&w=740"
                alt="User"
                sx={{ width: 56, height: 56, marginRight: '16px' }}
            />
            <Box sx={{ flex: 1 }}>
                <CardContent sx={{marginTop: 0, padding: 0}}>
                    <Typography variant="h6" fontWeight="bold">
                    {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {description}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon sx={{ fontSize: 16, marginRight: '4px' }} />
                        <Typography variant="body2" color="text.secondary">
                        {date}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircleIcon sx={{ fontSize: 12, color: 'green', marginRight: '4px' }} />
                        <Typography variant="body2" color="green">
                        {status}
                        </Typography>
                    </Box>
                    </Stack>
                </CardContent>
            </Box>
        </Box>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleStatusChange('In Progress')}>In Progress</MenuItem>
          <MenuItem onClick={() => handleStatusChange('Closed')}>Closed</MenuItem>
        </Menu>
  
        {/* Modal for description when status is closed */}
        <Modal open={openModal} onClose={handleModalClose}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 450,
              height: 350,
              bgcolor: 'white',
              borderRadius: '8px',
              p: 2,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: '16px', fontWeight: '700', textTransform: "uppercase" }}>
              Close Report
            </Typography>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
              sx={{ marginBottom: '16px' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Modal>
      </Card>
    );
  };
  
export default ReportCard;