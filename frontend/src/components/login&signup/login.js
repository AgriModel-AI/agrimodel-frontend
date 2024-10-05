import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon




const imageUrl = './assets/adult-harvesting-coffee.jpg';


const Login = () => {

const navigate = useNavigate(); 

// State to manage password visibility
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [isFocused, setIsFocused] = useState(false); // State to manage focus
const [isUsernameFocused, setIsUsernameFocused] = useState(false); // State to manage email focus

const [isPasswordFocused, setIsPasswordFocused] = useState(false);


const handleClickShowPassword = (e) => {
  e.preventDefault(); // Prevent focus on the input
  setShowPassword((prev) => !prev);
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

      {/* Box for the login form */}
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
  sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#005700' }} // Dark green color
>
  Sign In 
</Typography>




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

      {/* Password TextField */}
      <TextField
        label="Enter your password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onFocus={() => setIsPasswordFocused(true)} // Set focus state to true on focus
        onBlur={() => setIsPasswordFocused(false)} // Reset focus state on blur
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
            transition: 'transform 0.2s ease-in-out', // Smooth transition for label
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
   


<Typography
  variant="h6"
  gutterBottom
  sx={{
    fontWeight: 'semiBold',
    fontSize: '0.85rem',
    color: 'gray',
    ml: 24,
    cursor: 'pointer', // Change cursor to pointer on hover
    '&:hover': {
      color: 'blue', // Change color on hover (you can customize this)
    },
  }}
  onClick={() => navigate('/forgot-password')}
>
  Forgot Password
</Typography>


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
    onClick={() => navigate('/home')}
  >
    Login
  </Button>

  <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: 'semiBold',
            fontSize: '0.85rem',
            color: 'black',
            mt: 1,
            cursor: 'pointer',
            '&:hover': {
              color: 'blue',
            },
          }}
          onClick={() => navigate('/signup')}
        >
          Don't have an account? Sign Up
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
          Continue with Google
        </Button>

</Paper>

    </Box>
  );
};

export default Login;
