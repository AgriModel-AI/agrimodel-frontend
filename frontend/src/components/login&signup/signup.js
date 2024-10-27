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
          height: '450px', // Fixed height
          width: '650px',  // Fixed width
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Optional shadow for aesthetics
          borderRadius: '12px', // Rounded corners
          overflow: 'hidden', // Prevents overflow from content
        }}
      >
         {/* Box for the image with typography overlay */}
      <Box
        sx={{
          position: 'relative', // Set main container as relative for absolute positioning within
          flex: 1,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderTopLeftRadius: '12px', 
          borderBottomLeftRadius: '12px',
        }}
      >
        {/* Overlay text */}
        <Box
          sx={{
            position: 'absolute',
            top: '200px', 
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white', 
            fontWeight: 'bold',
            padding: '2px 10px', 
            border: '1px solid white', 
            borderRadius: '0px', 
          }}
        >
          <Typography variant="h6"> AgriModel </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: '50px', 
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white', 
            fontWeight: 'bold',
            padding: '2px 10px', 
            
            borderRadius: '6px', 
          }}
        >
          <Typography
            variant="h8"
            sx={{
              
              fontSize: '0.8rem', 
              fontWeight: 'bold', 
            }}
          >
            xxxxxx
          </Typography>
       </Box>
      </Box>

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
            sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#005700', mb: -0.5}}
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
              width: '270px',
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
              width: '270px',
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
              width: '270px',
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
              width: '270px',
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
                sx={{ transform: 'scale(0.6)', mt:-0.85}} // Reduces size of checkbox
              />
            }
            label={
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  ml:-1,
                  fontWeight: 'semiBold',
                  fontSize: '0.80rem',
                  color: 'black',
                  cursor: 'pointer',
                  display: 'inline', // Ensures text stays on the same line as checkbox
                }}
              >
                I agree with your
                <span> </span> 
                <span style={{ textDecoration: 'underline' , color: 'blue'}}>terms & conditions</span>
              </Typography>
            }
            sx={{ marginBottom: 0, display: 'flex', alignItems: 'center' }} // Ensures checkbox and label are aligned
          />


          <Button
            sx={{
              backgroundColor: '#008000',
              color: '#fff',
              marginTop: 0,
              width: '270px',
              fontWeight: 'bold',
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
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'semiBold',
              fontSize: '0.65rem',
              color: 'blue',
              mt: 1,
              cursor: 'pointer',
            }}
          >
            - OR -
          </Typography>

             {/* Google signup button */}
          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              fontWeight: 'semiBold',
              fontSize: '0.75rem',
              marginTop: 1,
              width: '270px',
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

          <Typography
            variant="body2"
            align="center"
            sx={{ marginTop: 2, color: 'black' }}
          >
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer', color: '#008000', fontWeight: 'bold' }}
            >
              Login
            </span>
          </Typography>

         
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
