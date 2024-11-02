import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  PinInputField,
  PinInput,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const email = new URLSearchParams(location.search).get('email') || '';

  const [step, setStep] = useState('code'); // 'code' or 'password'
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteCode = (value) => {
    setCode(value);
    setStep('password'); // Move to the password step
  };

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      });
      navigate('/reset-password-successful');
    } catch (error) {
      toast({
        title: 'Password Reset Failed',
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
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw" overflow="hidden">
      <Box
        display="flex"
        flexDirection="column"
        width="350px"
        height="420px"
        boxShadow="lg"
        borderRadius="md"
        p="8"
        bg="white"
        justifyContent="center"
        alignItems="center"
      >
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <VStack
            justify="center"
            align="center"
            spacing="6"
            width="100%"
            textAlign="center"
          >
            {step === 'code' && (
              <>
                <Text fontSize="xl" fontWeight="bold" color="green.700">
                  Enter Verification Code
                </Text>
                <Text fontSize="sm" color="black" textAlign="center">
                  We have sent a code to your email: {email}
                </Text>
                <HStack spacing="4" mt="8">
                  <PinInput onComplete={handleCompleteCode}>
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </>
            )}

            {step === 'password' && (
              <>
                <Text fontSize="xl" fontWeight="bold" color="green.700">
                  Reset Your Password
                </Text>
                <Text fontSize="sm" color="black" textAlign="center">
                  Enter your new password to reset your account
                </Text>
                <InputGroup size="md" width="100%" mt="4">
                  <Input
                    pr="4.5rem"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    focusBorderColor="green.700"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickShowNewPassword}
                      variant="ghost"
                    >
                      <Icon as={showNewPassword ? ViewOffIcon : ViewIcon} />
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <InputGroup size="md" width="100%" mt="4">
                  <Input
                    pr="4.5rem"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    focusBorderColor="green.700"
                    _hover={{ borderColor: 'gray.400' }}
                  />
                  <InputRightElement width="3rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleClickShowConfirmPassword}
                      variant="ghost"
                    >
                      <Icon as={showConfirmPassword ? ViewOffIcon : ViewIcon} />
                    </Button>
                  </InputRightElement>
                </InputGroup>

                <Button
                  colorScheme="green"
                  width="100%"
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  mt="6"
                >
                  {isLoading ? <Spinner size="sm" /> : 'Continue'}
                </Button>

                <Button
                  variant="outline"
                  colorScheme="green"
                  width="100%"
                  onClick={() => setStep('code')}
                  mt="2"
                >
                  Back
                </Button>
              </>
            )}
          </VStack>
        </motion.div>
      </Box>
    </Box>
  );
};

export default ResetPassword;
