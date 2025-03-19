import React, { useState } from 'react';
import {
  Box, Button, Text, Input, VStack, Icon, useToast,
  Container, Heading, useColorModeValue, ScaleFade,
  FormControl, FormLabel, FormErrorMessage, InputGroup,
  Flex, Circle
} from '@chakra-ui/react';
import { LockIcon, EmailIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modern color scheme
  const bg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = 'green.500';
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const iconBg = useColorModeValue('green.50', 'green.900');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setIsEmailInvalid(false);
    setErrorMessage('');
  };

  const handleContinue = async () => {
    setErrorMessage('');

    if (!email) {
      setIsEmailInvalid(true);
      setErrorMessage('Please enter your email address.');
      return;
    }
    
    if (!validateEmail(email)) {
      setIsEmailInvalid(true);
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/password-reset`, {
        email,
      });

      toast({
        title: 'Recovery Email Sent',
        description: 'Check your inbox for the password reset code.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      navigate(`/reset-password?email=${email}`);
    } catch (error) {
      toast({
        title: 'Request Failed',
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
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      py={12}
      px={4}
    >
      <Container maxW="md" p={0}>
        <ScaleFade initialScale={0.9} in={true}>
          <MotionBox
            bg={bg}
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            w="100%"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={6} align="stretch">
              <Flex justifyContent="center" mb={2}>
                <Circle 
                  size="80px" 
                  bg={iconBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={LockIcon} w={8} h={8} color={accentColor} />
                </Circle>
              </Flex>
              
              <Box textAlign="center">
                <Heading as="h2" size="lg" color={textColor} mb={2}>
                  Forgot Password
                </Heading>
                <Text color={subTextColor} fontSize="md">
                  Enter your email to receive a reset code
                </Text>
              </Box>

              <FormControl isInvalid={isEmailInvalid} mt={4}>
                <FormLabel htmlFor="email" fontWeight="medium">Email Address</FormLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleChange}
                  size="lg"
                  borderRadius="md"
                  _focus={{ 
                    borderColor: accentColor, 
                    boxShadow: `0 0 0 1px ${accentColor}` 
                  }}
                  _hover={{ borderColor: 'gray.400' }}
                />
                {errorMessage && (
                  <FormErrorMessage>{errorMessage}</FormErrorMessage>
                )}
              </FormControl>

              <VStack spacing={4} mt={4}>
                <MotionBox
                  as={Button}
                  colorScheme="green"
                  size="lg"
                  width="full"
                  isLoading={isLoading}
                  loadingText="Sending..."
                  onClick={handleContinue}
                  borderRadius="md"
                  boxShadow="md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  leftIcon={!isLoading ? <EmailIcon /> : undefined}
                >
                  Send Reset Code
                </MotionBox>
                
                <Button 
                  variant="outline" 
                  colorScheme="green" 
                  size="lg"
                  width="full"
                  onClick={() => navigate('/login')}
                  leftIcon={<ArrowBackIcon />}
                  borderRadius="md"
                >
                  Back to Login
                </Button>
              </VStack>
              
              <Text fontSize="sm" color={subTextColor} textAlign="center" mt={4}>
                Remember your password? <Text as="span" color={accentColor} fontWeight="medium" cursor="pointer" _hover={{ textDecoration: 'underline' }} onClick={() => navigate('/login')}>Sign in</Text>
              </Text>
            </VStack>
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default ForgotPassword;