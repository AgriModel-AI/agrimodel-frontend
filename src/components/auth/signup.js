import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
  Image,
  Checkbox,
  InputGroup,
  InputRightElement,
  Link,
  VStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { AiOutlineGoogle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
        boxShadow="md"
        borderRadius="md"
        overflow="hidden"
      >
        {/* Image section */}
        <Box flex="1" position="relative">
          <Image src={imageUrl} alt="Signup Background" objectFit="cover" height="100%" />
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            color="white"
            fontWeight="bold"
            textAlign="center"
          >
            AgriModel
          </Text>
        </Box>

        {/* Form section */}
        <Box
          flex="1"
          p="6"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="white"
          borderRadius="md"
        >
          <Text fontSize="lg" fontWeight="bold" color="green.600" mb="4">
            Create an Account
          </Text>

          <VStack spacing="3" width="100%" maxW="270px">
            {/* Full Name Input */}
            <Input
              placeholder="Enter your Full Name"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              size="sm"
              focusBorderColor="green.500"
            />

            {/* Email Input */}
            <Input
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="sm"
              focusBorderColor="green.500"
            />

            {/* Phone Input */}
            <Input
              placeholder="Enter your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="sm"
              focusBorderColor="green.500"
            />

            {/* Password Input */}
            <InputGroup size="sm">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="green.500"
              />
              <InputRightElement width="2.5rem">
                <Button h="1.5rem" size="sm" onClick={handleClickShowPassword}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>

            {/* Terms and Conditions */}
            <Checkbox
              isChecked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              size="sm"
              colorScheme="green"
            >
              I agree with your{' '}
              <Link href="#" color="blue.500" textDecoration="underline">
                terms & conditions
              </Link>
            </Checkbox>

            {/* Signup Button */}
            <Button
              colorScheme="green"
              width="100%"
              isDisabled={!agreed}
              onClick={() => navigate('/home')}
              size="sm"
            >
              Signup
            </Button>

            <Text fontSize="xs" color="blue.500" textAlign="center">
              - OR -
            </Text>

            {/* Google Signup Button */}
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<AiOutlineGoogle />}
              width="100%"
              size="sm"
              onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/google-auth`}
            >
              Signup with Google
            </Button>

            <Text fontSize="sm" textAlign="center">
              Already have an account?{' '}
              <Text as="span" color="green.500" fontWeight="bold" cursor="pointer" onClick={() => navigate('/login')}>
                Login
              </Text>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
