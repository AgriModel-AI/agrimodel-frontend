import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Input,
  InputGroup,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { LockIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = () => {
    setErrorMessage('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    navigate('/verification-code');
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
        width="650px"
        boxShadow="lg"
        borderRadius="md"
        overflow="hidden"
      >
        {/* Image Section */}
        <Box
          flex="1"
          bgImage={`url(${imageUrl})`}
          bgSize="cover"
          bgPosition="center"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
          position="relative"
        >
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontWeight="bold"
            fontSize="lg"
          >
            AgriModel
          </Text>
          <Text
            position="absolute"
            bottom="5"
            left="50%"
            transform="translateX(-50%)"
            color="white"
            fontWeight="bold"
            fontSize="sm"
          >
            xxxxxx
          </Text>
        </Box>

        {/* Form Section */}
        <VStack
          flex="1"
          p="6"
          justify="center"
          align="center"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
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
            <Text color="red.500" fontSize="sm" mt="1">
              {errorMessage}
            </Text>
          )}

          <InputGroup size="md">
            <Input
              placeholder="Enter your email"
              ml={4}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              width="270px"
              borderColor="gray.300"
              focusBorderColor="green.700"
              _hover={{ borderColor: 'gray.400' }}
            />
          </InputGroup>

          <Button
            colorScheme="green"
            width="270px"
            onClick={handleContinue}
            mt="5"
          >
            Continue
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
