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
                    height: '80%',
                    width: '60%',
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
                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: '120px' }} /> {/* Adjusted icon size */}
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
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'semibold', fontSize: '0.80rem', mb:8 }}
                    >
                        Congratulations! Your password has been changed.
                    </Typography>

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
                        onClick={() => navigate('/signin')}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default ResetSuccessful;
