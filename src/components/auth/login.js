import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  Image,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../../redux/slices/userSlice';
import axiosInstance from '../../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { AiOutlineGoogle } from 'react-icons/ai';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validateInputs = () => {
    if (!email) {
      toast({
        title: 'Validation Error',
        description: 'Email is required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (!password) {
      toast({
        title: 'Validation Error',
        description: 'Password is required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`, {
        email,
        password,
      });
      const { access_token, refresh_token } = response.data;

      dispatch(login({ access_token, refresh_token }));
      toast({
        title: 'Login successful!',
        description: 'You are now logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" px="1">
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        width={{ base: '100%', sm: '100%', md: '700px', lg: '800px' }}
        boxShadow="md"
        borderRadius="md"
        overflow="hidden"
      >
        {/* Image Section */}
        <Box
          flex="1"
          display={{ base: 'none', md: 'block' }}
          position="relative"
        >
          <Image src={imageUrl} alt="Login background" objectFit="cover" height="100%" width="100%" />
          <Text
            position="absolute"
            bottom="8"
            left="50%"
            transform="translateX(-50%)"
            color="white"
            fontWeight="bold"
            textAlign="center"
          >
            AgriModel
          </Text>
        </Box>

        {/* Form Section */}
        <Box flex="1" bg="white" p={{ base: '6', md: '8' }} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Text fontSize="xl" fontWeight="bold" color="green.600" mb="4">
            SIGN IN
          </Text>

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px' }}>
            {/* Email Input */}
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mb="4"
            />

            {/* Password Input */}
            <InputGroup size="md" mb="4">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClickShowPassword}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* Forgot Password */}
            <Text
              as="a"
              color="green.600"
              cursor="pointer"
              fontSize="sm"
              alignSelf="flex-end"
              onClick={() => navigate('/forgot-password')}
              mb="4"
              textAlign="right"
            >
              Forgot Password?
            </Text>

            {/* Login Button */}
            <Button colorScheme="green" width="100%" type="submit" isLoading={isLoading}>
              {isLoading ? <Spinner size="sm" /> : 'Login'}
            </Button>
          </form>

          {/* Sign Up Link */}
          {/* <Text fontSize="sm" mt="4">
            Don't have an account?{' '}
            <Text as="span" color="green.600" cursor="pointer" fontWeight="bold" onClick={() => navigate('/signup')}>
              Sign Up
            </Text>
          </Text> */}

          {/* Divider */}
          <Text fontSize="sm" color="gray.500" my="4">
            OR
          </Text>

          {/* Google Sign-In Button */}
          <Button
            variant="outline"
            colorScheme="red"
            width="100%"
            maxW="300px"
            leftIcon={<AiOutlineGoogle />}
            onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/google-auth`}
          >
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
