import React from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  Image,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons'; // Chakra's check circle icon
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const ResetSuccessful = () => {
  const navigate = useNavigate();

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
        {/* Left Image Box */}
        <Box
          flex="1"
          position="relative"
          backgroundImage={`url(${imageUrl})`}
          backgroundSize="cover"
          backgroundPosition="center"
          borderTopLeftRadius="md"
          borderBottomLeftRadius="md"
        >
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontWeight="bold"
            fontSize="lg"
            textAlign="center"
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

        {/* Success Message Box */}
        <VStack
          flex="1"
          p="6"
          spacing="4"
          justifyContent="center"
          alignItems="center"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
          bg="white"
        >
          <Icon as={CheckCircleIcon} boxSize="24" color="green.700" />

          <Text fontSize="2xl" fontWeight="bold" color="green.700" textAlign="center">
            Successful
          </Text>

          <Text fontSize="sm" color="black" textAlign="center" mb="8">
            Congratulations! Your password has been changed.
          </Text>

          <Button
            colorScheme="green"
            width="full"
            maxW="270px"
            onClick={() => navigate('/login')}
          >
            Continue
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ResetSuccessful;
