import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  PinInputField,
  PinInput,
  useToast,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Extract email from URL query parameters
  const email = new URLSearchParams(location.search).get('email') || '';
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleComplete = async (value) => {
    setCode(value);
    setIsVerifying(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/validate-code`, {
        email,
        code: value,
      });

      if (response.status === 200) {
        toast({
          title: 'Account verified!',
          description: 'You can now log in to your account.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login');
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error.response?.data?.message || 'An error occurred during verification.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/resend-code`, { email });
      if (response.status === 200) {
        toast({
          title: 'Verification code resent!',
          description: 'Please check your email for the new code.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Resend failed',
        description: error.response?.data?.message || 'Failed to resend verification code.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw" overflow="hidden">
      <Box display="flex" height="450px" width="650px" boxShadow="lg" borderRadius="md" overflow="hidden">
        {/* Image Section */}
        <Box flex="1" bgImage={`url(${imageUrl})`} bgSize="cover" bgPosition="center" borderTopLeftRadius="md" borderBottomLeftRadius="md" position="relative">
          <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" color="white" fontWeight="bold" fontSize="lg">
            AgriModel
          </Text>
        </Box>

        {/* Form Section */}
        <VStack flex="1" p="6" justify="center" align="center" borderTopRightRadius="md" borderBottomRightRadius="md" bg="white" spacing="4">
          <Text fontSize="xl" fontWeight="bold" color="green.700">Enter Verification Code</Text>
          <Text fontSize="sm" color="black" textAlign="center">
            We have sent a code to your email: {email || 'your email'}
          </Text>

          {/* Code Input Fields */}
          <HStack spacing="4" mt="2" mb="4">
            <PinInput otp onComplete={handleComplete}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>

          {/* Verify Button */}
          <Button colorScheme="green" width="270px" fontWeight="bold" onClick={() => handleComplete(code)} isLoading={isVerifying}>
            Verify
          </Button>

          {/* Resend Code Option */}
          <Text fontSize="0.85rem" color="black" mt="4" cursor="pointer" _hover={{ color: 'blue.500' }} onClick={handleResendCode} isLoading={isResending}>
            Didn't receive code? Resend Code
          </Text>

          {/* Back to Signup Button */}
          <Button colorScheme="gray" variant="link" mt="4" onClick={() => navigate('/signup')}>
            Back to Signup
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default VerifyAccount;
