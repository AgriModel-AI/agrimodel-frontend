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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      const { access_token } = response.data;
      dispatch(login({ access_token }));
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Box display="flex" width="650px" boxShadow="md" borderRadius="md" overflow="hidden">
        
        {/* Image Section */}
        <Box flex="1" position="relative">
          <Image src={imageUrl} alt="Login background" objectFit="cover" height="100%" />
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
        <Box flex="1" bg="white" p="6" display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="green.600" mb="4">
            Sign In
          </Text>

          {/* Email Input */}
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb="4"
            width="100%"
          />

          {/* Password Input */}
          <InputGroup size="md" width="100%" mb="4">
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
          >
            Forgot Password?
          </Text>

          {/* Login Button */}
          <Button colorScheme="green" width="100%" mb="4" onClick={handleSubmit}>
            Login
          </Button>

          {/* Sign Up Link */}
          <Text fontSize="sm" mb="2">
            Don't have an account?{' '}
            <Text as="span" color="green.600" cursor="pointer" fontWeight="bold" onClick={() => navigate('/signup')}>
              Sign Up
            </Text>
          </Text>

          {/* Divider */}
          <Text fontSize="sm" color="gray.500" mb="4">
            OR
          </Text>

          {/* Google Sign-In Button */}
          <Button variant="outline" colorScheme="red" width="100%" leftIcon={<AiOutlineGoogle />} onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/google-auth`}>
            Sign in with Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
