import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ResetSuccessful = () => {
    const navigate = useNavigate();

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

                {/* Box for the Reset Successful message */}
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
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '140px', // Set height of the box
                            width: '140px',  // Set width of the box
                        }}
                    >
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '120px' , color: '#005700'}} /> {/* Adjusted icon size */}
                    </Box>

                    <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', fontSize: '2rem', color: '#005700' }}
                    >
                        Successful
                    </Typography>

                    <Typography
                        variant="h2"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', fontSize: '0.65rem', mb:14 , color: 'black'}}
                    >
                        Congratulations! Your password has been changed.
                    </Typography>

                    <Button
                        sx={{
                            backgroundColor: "#008000",
                            color: "#fff",
                            marginTop: 2,
                            width: '270px',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: "#005700",
                            },
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ResetSuccessful;
