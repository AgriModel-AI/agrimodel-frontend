import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment, Checkbox, FormControlLabel  } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon

import { useNavigate } from 'react-router-dom';
const imageUrl = './assets/adult-harvesting-coffee.jpg';


const Signup = () => {
    const navigate = useNavigate();
    
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isNamesFocused, setIsNamesFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [agreed, setAgreed] = useState(false); // State to manage checkbox


  const handleClickShowPassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100%',
      }}
    >
      {/* Image Box */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Signup Form */}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#005700' }}
        >
          Create an account
        </Typography>

        {/* Full Name TextField */}
        <TextField
          label="Enter your Full Name"
          variant="outlined"
          margin="normal"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          onFocus={() => setIsNamesFocused(true)}
          onBlur={() => setIsNamesFocused(false)}
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
              transform: isNamesFocused || names ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
              transition: 'transform 0.2s ease-in-out',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
            },
          }}
        />

        {/* Email TextField */}
        <TextField
          label="Enter your Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
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
              transform: isEmailFocused || email ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
              transition: 'transform 0.2s ease-in-out',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
            },
          }}
        />

        {/* Phone TextField */}
        <TextField
          label="Enter your Phone"
          variant="outlined"
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setIsPhoneFocused(true)}
          onBlur={() => setIsPhoneFocused(false)}
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
              transform: isPhoneFocused || phone ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
              transition: 'transform 0.2s ease-in-out',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
            },
          }}
        />

        {/* Password TextField */}
        <TextField
          label="Enter your Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
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
              transform: isPasswordFocused || password ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
              transition: 'transform 0.2s ease-in-out',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'gray',
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClickShowPassword}
                sx={{ cursor: 'pointer' }}
              >
                {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
              </InputAdornment>
            ),
          }}
        />

         {/* Checkbox with Terms and Conditions */}
         <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)} // Handle checkbox change
              name="termsCheckbox"
            />
          }
          label={
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: 'semiBold',
                fontSize: '0.85rem',
                color: 'black',
                cursor: 'pointer',
                '&:hover': {
                  color: 'blue',
                },
              }}
            >
              I agree with your terms & conditions
            </Typography>
          }
          sx={{ marginBottom: 0 }}
        />

        <Button
          sx={{
            backgroundColor: '#008000',
            color: '#fff',
            marginTop: 0,
            width: '300px',
            '&:hover': {
              backgroundColor: '#005700',
            },
          }}
        >
          Sign Up
        </Button>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'semiBold',
            fontSize: '0.85rem',
            color: 'black',
            mt: 0.5,
            cursor: 'pointer',
            '&:hover': {
              color: 'blue',
            },
          }}
          onClick={() => navigate('/Signin')}
        >
          Already have an account? Login
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'semiBold',
            fontSize: '0.85rem',
            color: 'black',
            mt: 0.5,
            cursor: 'pointer',
            '&:hover': {
              color: 'blue',
            },
          }}
        >
         - OR- 
        </Typography>

         {/* Google Sign-Up Button */}
         <Button
          variant="outlined"
          startIcon={<GoogleIcon />} // Add Google icon at the start
          sx={{
            backgroundColor: 'white',
            color: 'black',
            borderColor: 'black', // Black border
            marginTop: 2,
            width: '300px',
            textTransform: 'none', // Keep text as it is (no uppercase)
            '&:hover': {
              backgroundColor: '#f5f5f5', // Light gray background on hover
              borderColor: 'black', // Maintain black border on hover
            },
          }}
        >
          Sign Up with Google
        </Button>


      </Paper>
    </Box>
  );
};

export default Signup;
