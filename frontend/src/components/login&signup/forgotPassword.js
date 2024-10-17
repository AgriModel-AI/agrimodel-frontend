import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = () => {
    // Reset error message
    setErrorMessage('');

    // Check if email is empty
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // Check if email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // If valid, navigate to verification code page
    navigate('/verification-code');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height for vertical centering
        width: '100vw', // Full viewport width
        overflow: 'hidden',
      }}
    >
      {/* Main content box */}
      <Box
        sx={{
          display: 'flex',
          height: '450px', // Fixed height
          width: '650px',  // Fixed width
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Optional shadow for aesthetics
          borderRadius: '12px', // Rounded corners
          overflow: 'hidden', // Prevents overflow from content
        }}
      >
        {/* Box for the image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: '12px', // Rounded corners
            borderBottomLeftRadius: '12px',
          }}
        />

        {/* Box for the Forgot Password form */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: '12px', // Rounded corners
            borderBottomRightRadius: '12px',
            backgroundColor: '#fff', // White background for the form
            overflow: 'hidden',
            maxWidth: '100%', // Prevents content from exceeding box width
            maxHeight: '100%', // Prevents content from exceeding box height
          }}
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#005700', mb: 1  }}
          >
            Forgot Password
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'semibold', fontSize: '0.75rem', color: 'black' }}
          >
            Enter your email address to reset your account
          </Typography>

          {/* Lock Icon */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '140px',
              width: '140px',
              mb: 0, // Margin below the icon
            }}
          >
            <LockResetIcon sx={{ fontSize: '120px', color: '#005700' }} />
          </Box>

          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}

          {/* Email TextField */}
          <TextField
            label="Enter your email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
            sx={{
              width: '270px', // Ensure it fits within the box
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
                transition: 'transform 0.2s ease-in-out',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'gray',
              },
            }}
          />

           

          {/* Continue Button */}
          <Button
            sx={{
              backgroundColor: "#008000",
              color: "#fff",
              marginTop: 5,
              width: '270px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: "#005700",
              },
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>

          {/* Cancel Button */}
          <Button
            sx={{
              backgroundColor: "white",
              color: "#008000",
              border: "1px solid #008000",
              marginTop: 1,
              width: '270px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => navigate('/login')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
