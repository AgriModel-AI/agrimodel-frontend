import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Input,
  InputGroup,
  VStack,
  Icon,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/password-reset`, {
        email,
      });

      toast({
        title: 'Email Sent',
        description: 'Check your inbox for the verification code.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate(`/reset-password?email=${email}`);
    } catch (error) {
      toast({
        title: 'An error occurred. Please try again.',
        description: error.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      overflow="hidden"
    >
      <Box
        display="flex"
        height="450px"
        width="450px"
        boxShadow="lg"
        borderRadius="md"
        overflow="hidden"
        padding={5}
      >
        {/* Form Section */}
        <VStack
          flex="1"
          p="6"
          justify="center"
          align="center"
          bg="white"
          spacing="4"
        >
          <Text fontSize="xl" fontWeight="bold" color="green.700">
            Forgot Password
          </Text>
          <Text fontSize="sm" color="black" textAlign="center">
            Enter your email address to reset your account
          </Text>

          <Box display="flex" alignItems="center" justifyContent="center" height="140px" width="140px">
            <Icon as={LockIcon} boxSize="12" color="green.700" />
          </Box>

          {errorMessage && (
            <Text color="red.500" fontSize="sm">
              {errorMessage}
            </Text>
          )}

          <InputGroup size="md">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              width="270px"
              borderColor="gray.300"
              focusBorderColor="green.700"
              _hover={{ borderColor: 'gray.400' }}
              margin={"auto"}
            />
          </InputGroup>

          <Button
            colorScheme="green"
            width="270px"
            onClick={handleContinue}
            isLoading={isLoading}
            mt="5"
          >
            {isLoading ? <Spinner size="sm" /> : 'Continue'}
          </Button>

          <Button
            variant="outline"
            colorScheme="green"
            width="270px"
            mt="2"
            onClick={() => navigate('/login')}
          >
            Cancel
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
