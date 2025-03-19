import React, { useState } from 'react';
import {
  Box, Button, Text, VStack, HStack, PinInput, PinInputField,
  useToast, Container, Heading, Icon, useColorModeValue, 
  ScaleFade, Flex, useInterval
} from '@chakra-ui/react';
import { CheckIcon, EmailIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Extract email from URL query parameters
  const email = new URLSearchParams(location.search).get('email') || '';
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Modern color scheme
  const bg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = 'green.500';
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const iconBg = useColorModeValue('green.50', 'green.900');

  useInterval(() => {
    if (resendTimer > 0) {
      setResendTimer(resendTimer - 1);
    }
  }, resendTimer > 0 ? 1000 : null);

  const handleComplete = async (value) => {
    setCode(value);
    await verifyCode(value);
  };
  
  const verifyCode = async (verificationCode) => {
    if (!verificationCode || verificationCode.length !== 4) return;
    
    setIsVerifying(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/validate-code`, {
        email,
        code: verificationCode,
      });

      if (response.status === 200) {
        // Show success animation before redirecting
        toast({
          title: 'Account verified!',
          description: 'You can now log in to your account.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: error.response?.data?.message || 'An error occurred during verification.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
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
          position: 'top',
        });
        setResendTimer(60); // Start 60 second countdown
      }
    } catch (error) {
      toast({
        title: 'Resend failed',
        description: error.response?.data?.message || 'Failed to resend verification code.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg={containerBg}
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
              <Flex justifyContent="center">
                <Box 
                  p={3} 
                  borderRadius="full" 
                  bg={iconBg} 
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={EmailIcon} w={6} h={6} color={accentColor} />
                </Box>
              </Flex>
              
              <Box textAlign="center">
                <Heading as="h2" size="lg" color={textColor} mb={2}>
                  Verify Your Account
                </Heading>
                <Text color={subTextColor} fontSize="md">
                  We've sent a verification code to 
                  <Text as="span" fontWeight="bold" color={textColor}> {email || 'your email'}</Text>
                </Text>
              </Box>

              <VStack spacing={6} align="center" my={4}>
                <HStack spacing={3}>
                  <PinInput 
                    size="lg" 
                    otp 
                    onComplete={handleComplete}
                    isDisabled={isVerifying}
                    colorScheme="green"
                  >
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                      h="56px"
                      w="56px"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                      h="56px"
                      w="56px"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                      h="56px"
                      w="56px"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                      h="56px"
                      w="56px"
                    />
                  </PinInput>
                </HStack>
              </VStack>

              <MotionBox
                as={Button}
                colorScheme="green"
                size="lg"
                borderRadius="md"
                isLoading={isVerifying}
                loadingText="Verifying..."
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => verifyCode(code)}
                boxShadow="md"
                mt={2}
                leftIcon={!isVerifying ? <CheckIcon /> : undefined}
              >
                Verify Account
              </MotionBox>

              <HStack justify="center" mt={4}>
                <Text fontSize="sm" color={subTextColor}>
                  Didn't receive a code?
                </Text>
                <Button 
                  variant="link" 
                  colorScheme="green" 
                  size="sm"
                  isDisabled={resendTimer > 0 || isResending}
                  onClick={handleResendCode}
                  isLoading={isResending}
                  loadingText="Sending..."
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                </Button>
              </HStack>
              
              <Button 
                mt={4}
                onClick={() => navigate('/signup')}
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              >
                Back to signup
              </Button>
            </VStack>
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default VerifyAccount;