import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';
const imageUrl = './assets/adult-harvesting-coffee.jpg';





const ForgotPassword = () => {

    const navigate = useNavigate();

// State to manage  visibility
const [email, setEmail] = useState('');
const [isUsernameFocused, setIsUsernameFocused] = useState(false); 




  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh', // Use the full height of the viewport
        width: '100%',
      }}
    >
      {/* Box for the image */}
      <Paper
        elevation={3}
        sx={{
          flex: 1, // Use flexible width
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Box for the ForgotPassword form */}
      <Paper
  elevation={3}
  sx={{
    padding: 3,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Center items horizontally
  }}
>
<Typography
  variant="h6" // Ensure you specify a valid variant
  align="center"
  gutterBottom
  sx={{ fontWeight: 'Semibold', fontSize: '2rem',color: '#005700' }} // Dark green color
>
  Forgot Password
</Typography>

<Typography
  variant="h6" // Ensure you specify a valid variant
  align="center"
  gutterBottom
  sx={{ fontWeight: 'Semibold', fontSize: '0.875rem' , mt:-2}} // Dark green color
>
  Enter your e-mail address to reset your account
</Typography>

<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px', // Set height of the box
    width: '140px',  // Set width of the box
  }}
>
  <LockResetIcon sx={{ fontSize: '120px' }} /> {/* Adjusted icon size */}
</Box>

  {/* Email TextField */}
  <TextField
        label="Enter your email"
        variant="outlined"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setIsUsernameFocused(true)} // Set focus state to true on focus
        onBlur={() => setIsUsernameFocused(false)} // Reset focus state on blur
        sx={{
          width: '300px',
          height: '40px',
          '& .MuiInputBase-root': {
            borderRadius: '8px',
            height: '100%',
          },
          '& .MuiOutlinedInput-root': {
            height: '100%',
            '& input': {
              padding: '10px',
              fontSize: '0.875rem',
            },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.875rem',
            transform: isUsernameFocused || email ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
            transition: 'transform 0.2s ease-in-out', // Smooth transition for label
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'gray',
          },
        }}
      />


  <Button
    sx={{
      backgroundColor: "#008000",
      color: "#fff",
      marginTop: 2,
      width: '300px',
      '&:hover': {
        backgroundColor: "#005700",
      },
    }}
    onClick={() => navigate('/reset-password')}
  >
    Continue
  </Button>

  <Button
  sx={{
    backgroundColor: "white",   
    color: "#008000",          
    border: "1px solid #008000", 
    marginTop: 2,
    width: '300px',
    '&:hover': {
      backgroundColor: "#f0f0f0", 
    },
  }}
>
  Cancel
</Button>


</Paper>

    </Box>
  );
};

export default ForgotPassword;
