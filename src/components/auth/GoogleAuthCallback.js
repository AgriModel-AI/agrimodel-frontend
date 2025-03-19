import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Text, VStack } from '@chakra-ui/react';
import { FaSpinner } from 'react-icons/fa';

import { login, logout } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    // Get access and refresh tokens from URL params
    const queryParams = new URLSearchParams(location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Store tokens in local storage
      dispatch(login({ access_token: accessToken, refresh_token: refreshToken }));

      // Navigate to dashboard after storing tokens
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Short delay for user experience
    } else {
      // Handle missing tokens (optional)
      console.error('Tokens are missing from the URL.');
      navigate('/login');
    }
  }, [navigate, location, dispatch]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bg="gray.100">
      <VStack spacing="4" align="center">
        <FaSpinner className="animate-spin text-green-500" size={50} />
        <Text fontSize="2xl" fontWeight="bold" color="green.700">
          Processing...
        </Text>
        <Text fontSize="md" color="gray.600" textAlign="center">
          We are verifying your account. This may take a few moments.
        </Text>
      </VStack>
    </Box>
  );
};

export default GoogleAuthCallback;
