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
  Flex,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Divider,
  useColorModeValue,
  ScaleFade,
  SlideFade,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../../redux/slices/userSlice';
import axiosInstance from '../../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { AiOutlineGoogle } from 'react-icons/ai';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const imageUrl = './assets/adult-harvesting-coffee.jpg';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Color mode values for dark/light theme support
  const cardBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const primaryColor = 'green.500';
  const secondaryColor = 'green.600';

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
        position: 'top',
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
        position: 'top',
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
        position: 'top',
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
        position: 'top',
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      bgGradient="linear(to-br, gray.50, green.50)"
      p={4}
    >
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          width={{ base: '100%', sm: '450px', md: '800px', lg: '900px' }}
          boxShadow="xl"
          borderRadius="2xl"
          overflow="hidden"
          bg={cardBg}
        >
          {/* Image Section with Overlay */}
          <Box
            flex="1.2"
            display={{ base: 'none', md: 'block' }}
            position="relative"
          >
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="linear(to-b, rgba(0,0,0,0.3), rgba(0,0,0,0.7))"
              zIndex="1"
            />
            <Image 
              src={imageUrl} 
              alt="Login background" 
              objectFit="cover" 
              height="100%" 
              width="100%" 
            />
            <VStack
              position="absolute"
              bottom="10"
              left="50%"
              transform="translateX(-50%)"
              color="white"
              textAlign="center"
              spacing={3}
              zIndex="2"
            >
              <Heading fontSize="4xl" fontWeight="extrabold">
                AgriModel
              </Heading>
              <Text maxW="80%" fontSize="md">
                Advanced agricultural solutions for sustainable farming
              </Text>
            </VStack>
          </Box>

          {/* Form Section */}
          <Flex 
            flex="1" 
            bg={cardBg} 
            p={{ base: '6', md: '10' }} 
            direction="column" 
            alignItems="center" 
            justifyContent="center"
          >
            <VStack w="100%" maxW="350px" spacing={8}>
              <SlideFade in={true} offsetY="-20px">
                <VStack spacing={1} mb={4}>
                  <Box 
                    display={{ base: 'block', md: 'none' }}
                    mb={4}
                  >
                    <Heading color={primaryColor} fontSize="2xl" fontWeight="extrabold">
                      AgriModel
                    </Heading>
                  </Box>
                  <Heading 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color={secondaryColor} 
                    letterSpacing="wide"
                  >
                    WELCOME BACK
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    Sign in to your account
                  </Text>
                </VStack>
              </SlideFade>

              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <VStack spacing={5} align="flex-start">
                  {/* Email Input */}
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
                    <InputGroup size="md">
                      <Input
                        bg={inputBg}
                        borderColor={borderColor}
                        borderRadius="lg"
                        fontSize="md"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        _focus={{
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`
                        }}
                        _hover={{
                          borderColor: 'gray.300'
                        }}
                      />
                    </InputGroup>
                  </FormControl>

                  {/* Password Input */}
                  <FormControl>
                    <Flex justify="space-between" align="center">
                      <FormLabel fontSize="sm" fontWeight="medium">Password</FormLabel>
                      <Text
                        as="a"
                        color={primaryColor}
                        cursor="pointer"
                        fontSize="xs"
                        fontWeight="medium"
                        onClick={() => navigate('/forgot-password')}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        Forgot Password?
                      </Text>
                    </Flex>
                    <InputGroup size="md">
                      <Input
                        bg={inputBg}
                        borderColor={borderColor}
                        borderRadius="lg"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        _focus={{
                          borderColor: primaryColor,
                          boxShadow: `0 0 0 1px ${primaryColor}`
                        }}
                        _hover={{
                          borderColor: 'gray.300'
                        }}
                      />
                      <InputRightElement width="3rem">
                        <Button 
                          h="1.5rem" 
                          size="sm" 
                          variant="ghost"
                          color="gray.400"
                          onClick={handleClickShowPassword}
                          _hover={{
                            color: primaryColor
                          }}
                        >
                          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {/* Login Button */}
                  <MotionBox
                    as={Button}
                    width="100%"
                    colorScheme="green"
                    size="md"
                    type="submit"
                    isLoading={isLoading}
                    borderRadius="lg"
                    mt={2}
                    boxShadow="md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
                    _hover={{
                      bgGradient: `linear(to-r, ${secondaryColor}, ${primaryColor})`,
                      boxShadow: 'lg'
                    }}
                  >
                    Sign in
                  </MotionBox>
                </VStack>
              </form>

              <Flex align="center" width="100%" my={2}>
                <Divider borderColor="gray.300" />
                <Text px={3} color="gray.500" fontSize="sm" fontWeight="medium">
                  OR
                </Text>
                <Divider borderColor="gray.300" />
              </Flex>

              {/* Google Sign-In Button */}
              <MotionBox
                as={Button}
                variant="outline"
                width="100%"
                height="42px"
                leftIcon={<AiOutlineGoogle size="20px" />}
                onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/google-auth`}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                color="gray.700"
                _hover={{
                  bg: 'gray.50',
                  borderColor: 'gray.400'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in with Google
              </MotionBox>

              
            </VStack>
          </Flex>
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Login;