import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';


const ResetSuccessful = () => {


    const navigate = useNavigate(); 

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

      {/* Box for the ResetSuccessful form */}
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




<Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '140px', // Set height of the box
    width: '140px',  // Set width of the box
  }}
>
  <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '120px' }} /> {/* Adjusted icon size */}

</Box>

<Typography
  variant="h6" // Ensure you specify a valid variant
  align="center"
  gutterBottom
  sx={{ fontWeight: 'bold', fontSize: '2rem', mb: 5 , color: '#005700'}} 
>
 Successful
</Typography>

 
<Typography
  variant="h6" // Ensure you specify a valid variant
  align="center"
  gutterBottom
  sx={{ fontWeight: 'Semibold', fontSize: '0.80rem' }}
>
Congratulations! Your password has been changed.
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
    onClick={() => navigate('/signin')}
  >
    Continue
  </Button>



</Paper>

    </Box>
  );
};

export default ResetSuccessful;
