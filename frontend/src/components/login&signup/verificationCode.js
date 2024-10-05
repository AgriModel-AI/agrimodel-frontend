import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const VerificationCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(new Array(4).fill('')); // Initialize with an array of 4 empty strings

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
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
          height: '80%', // Adjust as needed
          width: '60%',  // Adjust as needed
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

        {/* Box for the Verification Code form */}
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
            sx={{ fontWeight: 'bold', fontSize: '1.6rem', color: '#005700' }}
          >
            Enter Verification Code
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'semibold', fontSize: '0.875rem', color: 'black' }}
          >
            We have sent a code to your e-mail XXXXXXXXX
          </Typography>

          {/* Four square-sized TextField boxes for the verification code */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2, // Space between text fields
              mt: 4,
              mb: 10,
            }}
          >
            {code.map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    padding: 0,
                    width: '62px',
                    height: '45px',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    
                  },
                  backgroundColor: '#fff',
                }}
              />
            ))}
          </Box>

          {/* Verify Button */}
          <Button
            sx={{
              backgroundColor: "#008000",
              color: "#fff",
              marginTop: 2,
              width: '100%',
              maxWidth: '300px',
              '&:hover': {
                backgroundColor: "#005700",
              },
            }}
            onClick={() => navigate('/reset-password')}
          >
            Verify
          </Button>

          {/* Resend Code Button */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'semiBold',
              fontSize: '0.85rem',
              color: 'black',
              mt: 2,
              cursor: 'pointer',
              '&:hover': {
                color: 'blue',
              },
            }}
          >
            Didn't receive code? Resend Code
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VerificationCode;
