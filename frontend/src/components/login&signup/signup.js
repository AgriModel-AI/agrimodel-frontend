import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
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
          width: '60%', // Adjust as needed
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

        {/* Box for the signup form */}
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
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#005700', mb:-1.4 }}
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
              mb: -0.5,
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
              mb: -0.5,
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
              mb: -0.5,
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
                backgroundColor: '#006400',
              },
            }}
            variant="contained"
            onClick={() => navigate('/Home')}
            disabled={!agreed} // Disable button until the checkbox is checked
          >
            Signup
          </Button>

          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 2, color: 'black' }}
          >
            Already have an account?{' '}
            <span
              onClick={() => navigate('/signin')}
              style={{ cursor: 'pointer', color: '#008000', fontWeight: 'bold' }}
            >
              Login
            </span>
          </Typography>

          {/* Google signup button */}
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              marginTop: 2,
              width: '300px',
              borderColor: '#D32F2F', // Color for the border
              color: '#D32F2F', // Color for the text
              '&:hover': {
                backgroundColor: '#D32F2F',
                color: '#fff', // Change text color on hover
              },
            }}
          >
            Signup with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
