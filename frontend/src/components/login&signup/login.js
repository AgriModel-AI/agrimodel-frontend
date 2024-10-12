import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import GoogleIcon from '@mui/icons-material/Google'; // Import Google icon
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../../redux/slices/userSlice';
import axiosInstance from '../../utils/axiosConfig';
import { useDispatch } from 'react-redux';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const Login = () => {
  const navigate = useNavigate(); 

  // State to manage password visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false); // State to manage email focus
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // State to manage password focus
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Reset error message
    setErrorMessage('');

     // Check if both email and password is empty
     if (!email  && !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    // Check if email empty
    if (!email ) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    // Check if email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

     // Check if  password is empty
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }
    

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: email,
        password: password
      });

      const { access_token } = response.data;
      dispatch(login({ access_token }));
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Login failed. Please try again.'); // Handle login failure
    }
  };

  const handleClickShowPassword = (e) => {
    e.preventDefault(); // Prevent focus on the input
    setShowPassword((prev) => !prev);
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
      {/* Main content box with fixed size */}
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

        {/* Box for the login form */}
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
          }}
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#005700', mb: 1 }}
          >
            Sign In 
          </Typography>

          {/* Error Message */}
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
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
              width: '100%', // Ensure it fits within the box
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

          {/* Password TextField */}
          <TextField
            label="Enter your password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            sx={{
              width: '100%', // Ensure it fits within the box
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

          {/* Forgot Password */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'semiBold',
              fontSize: '0.85rem',
              color: 'black',
              cursor: 'pointer',
              ml:24,
              '&:hover': {
                color: '#008000',
              },
            }}
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password
          </Typography>

          {/* Login Button */}
          <Button
            sx={{
              backgroundColor: "#008000",
              color: "#fff",
              marginTop: 2,
              width: '100%',
              '&:hover': {
                backgroundColor: "#005700",
              },
            }}
            onClick={handleSubmit}
          >
            Login
          </Button>

          {/* Sign Up and Google Sign In */}
          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 2, color: 'black' }}
          >
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              style={{ cursor: 'pointer', color: '#008000', fontWeight: 'bold' }}
            >
              Sign Up
            </span>
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
            - OR -
          </Typography>

          {/* Google Sign-Up Button */}
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              marginTop: 2,
              width: '100%', // Full width
              borderColor: '#D32F2F', // Color for the border
              color: '#D32F2F', // Color for the text
              '&:hover': {
                backgroundColor: '#D32F2F',
                color: '#fff', // Change text color on hover
              },
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
