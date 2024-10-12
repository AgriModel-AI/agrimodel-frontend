import React, { useState } from 'react';
import { Box, TextField, Button, Typography, InputAdornment } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ResetPassword = () => {
  const navigate = useNavigate();

  // State to manage passwords and visibility
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const handleClickShowNewPassword = (e) => {
    e.preventDefault();
    setShowNewPassword((prev) => !prev);
  };

  const handleClickShowConfirmPassword = (e) => {
    e.preventDefault();
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Main content box */}
      <Box
        sx={{
          display: 'flex',
          height: '450px', // Fixed height
          width: '650px',  // Fixed width
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Box for the image */}
        <Box
          sx={{
            flex: 1,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
          }}
        />

        {/* Box for the Reset Password form */}
        <Box
          sx={{
            flex: 1,
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: '#fff',
            overflow: 'hidden',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: '1.6rem', color: '#005700' }}
          >
            Reset Your Password
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'semibold', fontSize: '0.875rem', color: 'black', mt:-1, mb: 4 }}
          >
            Enter your new password to reset your account
          </Typography>

          {/* New Password TextField */}
          <TextField
            label="Enter your new password"
            type={showNewPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onFocus={() => setIsNewPasswordFocused(true)}
            onBlur={() => setIsNewPasswordFocused(false)}
            sx={{
              width: '100%',
              maxWidth: '300px',
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
                transform: isNewPasswordFocused || newPassword ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
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
                  onClick={handleClickShowNewPassword}
                  sx={{ cursor: 'pointer' }}
                >
                  {showNewPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password TextField */}
          <TextField
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
            sx={{
              width: '100%',
              maxWidth: '300px',
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
                transform: isConfirmPasswordFocused || confirmPassword ? 'translate(14px, -10px) scale(0.75)' : 'translate(14px, 10px) scale(1)',
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
                  onClick={handleClickShowConfirmPassword}
                  sx={{ cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                </InputAdornment>
              ),
            }}
          />

          {/* Continue Button */}
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
            onClick={() => navigate('/reset-password-successful')}
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
              width: '100%',
              maxWidth: '300px',
              '&:hover': {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => navigate('/verification-code')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
