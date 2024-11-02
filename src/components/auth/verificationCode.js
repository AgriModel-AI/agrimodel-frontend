import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  PinInputField,
  PinInput
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


const imageUrl = './assets/adult-harvesting-coffee.jpg';

const VerificationCode = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(new Array(4).fill(''));

  const handleChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleComplete = (value) => {
    console.log("Code entered:", value);
    navigate('/reset-password');
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
            Enter Verification Code
          </Text>
          <Text fontSize="sm" color="black" textAlign="center">
            We have sent a code to your e-mail XXXXXXXXX
          </Text>

          {/* Code Input Fields */}
          <HStack spacing="4" mt="2" mb="8">
          <PinInput onComplete={handleComplete}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
          </HStack>

          {/* Verify Button */}
          <Button
            colorScheme="green"
            width="270px"
            fontWeight="bold"
            onClick={() => navigate('/reset-password')}
          >
            Verify
          </Button>

          {/* Resend Code Option */}
          <Text
            fontSize="0.85rem"
            color="black"
            mt="4"
            cursor="pointer"
            _hover={{ color: 'blue.500' }}
          >
            Didn't receive code? Resend Code
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default VerificationCode;
