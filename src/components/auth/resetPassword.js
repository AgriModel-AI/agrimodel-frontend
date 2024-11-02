import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

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
            Reset Your Password
          </Text>
          <Text fontSize="sm" color="black" textAlign="center">
            Enter your new password to reset your account
          </Text>

          {/* New Password Input */}
          <InputGroup size="md" width="270px">
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

          {/* Confirm Password Input */}
          <InputGroup size="md" width="270px">
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

          {/* Continue Button */}
          <Button
            colorScheme="green"
            width="270px"
            onClick={() => navigate('/reset-password-successful')}
            mt="4"
          >
            Continue
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outline"
            colorScheme="green"
            width="270px"
            onClick={() => navigate('/verification-code')}
            mt="2"
          >
            Cancel
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ResetPassword;
