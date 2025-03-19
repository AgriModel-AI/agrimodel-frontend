import React from 'react';
import {
  Box, Button, Text, VStack, Heading, Icon, Container,
  useColorModeValue, ScaleFade, Circle
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const ResetSuccessful = () => {
  const navigate = useNavigate();
  
  // Modern color scheme
  const bg = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const iconBg = useColorModeValue('green.50', 'green.900');
  
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
            textAlign="center"
          >
            <Circle 
              size="120px" 
              bg={iconBg} 
              mx="auto" 
              mb={6}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Icon 
                as={CheckCircleIcon} 
                w={16} 
                h={16} 
                color="green.500" 
              />
            </Circle>
            
            <Heading 
              as="h2" 
              size="xl" 
              color={textColor} 
              mb={4}
              bgGradient="linear(to-r, green.400, green.600)"
              bgClip="text"
            >
              Password Reset Complete
            </Heading>
            
            <Text fontSize="lg" color={subTextColor} mb={8}>
              Your password has been updated successfully. You can now log in with your new credentials.
            </Text>
            
            <MotionBox
              as={Button}
              colorScheme="green"
              size="lg"
              width="full"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              borderRadius="md"
              boxShadow="md"
            >
              Sign In
            </MotionBox>
          </MotionBox>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default ResetSuccessful;