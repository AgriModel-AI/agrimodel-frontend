import React, { useState } from 'react';
import {
  Box, Button, Text, VStack, HStack, PinInput, PinInputField,
  Input, InputGroup, InputRightElement, useToast, Container,
  Heading, Flex, useColorModeValue, Icon, ScaleFade,
  FormControl, FormLabel, FormErrorMessage
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon, LockIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const email = new URLSearchParams(location.search).get('email') || '';
  
  const [step, setStep] = useState('code');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Modern color scheme
  const bg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const accentColor = 'green.500';
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const handleCompleteCode = (value) => {
    setCode(value);
    setStep('password');
  };

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/password-reset/verify`, {
        email,
        token: code,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been reset successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      navigate('/reset-password-successful');
    } catch (error) {
      toast({
        title: 'Password Reset Failed',
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
            {step === 'code' ? (
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
                    <PinInput size="lg" otp onComplete={handleCompleteCode}>
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
                </VStack>

                <HStack justify="center" mt={4}>
                  <Text fontSize="sm" color={subTextColor}>
                    Didn't receive a code?
                  </Text>
                  <Button variant="link" colorScheme="green" size="sm">
                    Resend
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
            ) : (
              <VStack spacing={6} align="stretch">
                <Box textAlign="center">
                  <Icon as={LockIcon} w={12} h={12} color={accentColor} mb={4} />
                  <Heading as="h2" size="lg" color={textColor} mb={2}>
                    Set New Password
                  </Heading>
                  <Text color={subTextColor} fontSize="md">
                    Create a strong password for your account
                  </Text>
                </Box>

                <FormControl isInvalid={passwordError !== ''}>
                  <FormLabel htmlFor="new-password" fontWeight="medium">New Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      borderRadius="md"
                      size="md"
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        color="gray.500"
                        size="sm"
                        _hover={{ color: accentColor }}
                      >
                        <Icon as={showNewPassword ? ViewOffIcon : ViewIcon} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isInvalid={passwordError !== ''}>
                  <FormLabel htmlFor="confirm-password" fontWeight="medium">Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      borderRadius="md"
                      size="md"
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                    />
                    <InputRightElement>
                      <Button
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        color="gray.500"
                        size="sm"
                        _hover={{ color: accentColor }}
                      >
                        <Icon as={showConfirmPassword ? ViewOffIcon : ViewIcon} />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>

                <Flex direction="column" gap={4} mt={4}>
                  <MotionBox
                    as={Button}
                    colorScheme="green"
                    size="md"
                    isLoading={isLoading}
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    Reset Password
                  </MotionBox>
                  
                  <Button 
                    variant="outline" 
                    colorScheme="green" 
                    onClick={() => setStep('code')}
                    size="md"
                    borderRadius="md"
                  >
                    Back
                  </Button>
                </Flex>
              </VStack>
            )}
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default ResetPassword;