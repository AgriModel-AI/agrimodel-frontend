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

      {/* Box for the VerificationCode form */}
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
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'Semibold', fontSize: '2rem', color: '#005700' }}
        >
          Enter Verification Code
        </Typography>

        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'Semibold', fontSize: '0.875rem', mt: -2 }}
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
            mb: 10
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

        <Button
          sx={{
            backgroundColor: '#008000',
            color: '#fff',
            marginTop: 2,
            width: '300px',
            '&:hover': {
              backgroundColor: '#005700',
            },
          }}
          onClick={() => navigate('/reset-password')}
        >
          Verify
        </Button>

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
      </Paper>
    </Box>
  );
};

export default VerificationCode;
