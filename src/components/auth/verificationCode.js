import React, { useState } from 'react';
import {
  Box, Button, Text, VStack, HStack, PinInput, PinInputField,
  Container, Heading, Icon, useColorModeValue, ScaleFade,
  useToast, useInterval
} from '@chakra-ui/react';
import { LockIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const VerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const email = new URLSearchParams(location.search).get('email') || 'your email';
  
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Modern color scheme
  const bg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = 'green.500';
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  
  useInterval(() => {
    if (resendTimer > 0) {
      setResendTimer(resendTimer - 1);
    }
  }, resendTimer > 0 ? 1000 : null);

  const handleComplete = (value) => {
    setCode(value);
    setIsSubmitting(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/reset-password?email=${email}&code=${value}`);
    }, 1500);
  };
  
  const handleResendCode = () => {
    toast({
      title: 'Code resent',
      description: 'A new verification code has been sent to your email',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
    setResendTimer(60);
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
              <Box textAlign="center">
                <Icon as={LockIcon} w={12} h={12} color={accentColor} mb={4} />
                <Heading as="h2" size="lg" color={textColor} mb={2}>
                  Verification Code
                </Heading>
                <Text color={subTextColor} fontSize="md">
                  We've sent a code to <Text as="span" fontWeight="bold">{email}</Text>
                </Text>
              </Box>

              <VStack spacing={6} align="center" my={6}>
                <HStack spacing={3}>
                  <PinInput 
                    size="lg" 
                    otp 
                    onComplete={handleComplete}
                    isDisabled={isSubmitting}
                  >
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                    />
                    <PinInputField 
                      borderColor="gray.300" 
                      _hover={{ borderColor: accentColor }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      fontSize="xl"
                    />
                  </PinInput>
                </HStack>
                
                {isSubmitting && (
                  <Text fontSize="sm" color={accentColor} fontWeight="medium">
                    Verifying code...
                  </Text>
                )}
              </VStack>

              <HStack justify="center" mt={4}>
                <Text fontSize="sm" color={subTextColor}>
                  Didn't receive a code?
                </Text>
                <Button 
                  variant="link" 
                  colorScheme="green" 
                  size="sm"
                  isDisabled={resendTimer > 0}
                  onClick={handleResendCode}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                </Button>
              </HStack>
              
              <Button 
                mt={4}
                onClick={() => navigate('/login')}
                leftIcon={<ArrowBackIcon />}
                variant="ghost"
                size="sm"
              >
                Back to login
              </Button>
            </VStack>
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default VerificationCode;