import React, { useState } from 'react';
import { AiOutlineGoogle } from 'react-icons/ai';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Input, InputRightElement, InputGroup, useToast } from '@chakra-ui/react';
import axios from 'axios';

const imageUrl = './assets/adult-harvesting-coffee.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let formErrors = {};
    if (!username) formErrors.username = "Username is required.";
    if (!email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = "Email address is invalid.";
    if (!phone) formErrors.phone = "Phone number is required.";
    else if (!/^\+250\d{9}$/.test(phone)) {
      formErrors.phone = "Phone number format is invalid. It should be in the format: +250700000000.";
    }
    if (!password) formErrors.password = "Password is required.";
    else if (password.length < 8) formErrors.password = "Password must be at least 8 characters long.";
    if (password !== confirmpassword) formErrors.confirmpassword = "Passwords do not match.";
    if (!agreed) formErrors.agreed = "You must agree to the terms and conditions.";
    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateInputs();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/signup`, {
          email,
          username,
          password,
          phone_number: phone
        });
        
        toast({
          title: "Account created.",
          description: "We've created your account successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        navigate(`/verify-account?email=${email}`);
      } catch (error) {
        toast({
          title: "An error occurred.",
          description: error.response?.data?.message || "Unable to create account.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false); // Reset loading state
      }
    } else {
      toast({
        title: "Invalid input.",
        description: "Please correct the errors and try again.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full overflow-hidden bg-gray-100">
      <div className="flex flex-col md:flex-row h-auto md:h-auto w-11/12 md:w-[950px] shadow-md rounded-lg overflow-hidden bg-white">
        {/* Image section */}
        <div className="flex-1 relative hidden md:flex">
          <img src={imageUrl} alt="Signup Background" className="object-cover h-full w-full" />
        </div>

        {/* Form section */}
        <div className="flex-1 p-6 flex flex-col justify-center items-center bg-white">
          <p className="text-lg font-bold text-green-600 mb-4">CREATE AN ACCOUNT</p>

          <InputGroup className="flex flex-col gap-3 w-full max-w-xs">
            {/* Username Input */}
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm rounded focus:outline-none focus:border-green-500"
            />
            {errors.username && <p className="text-red-500 text-xs -mt-2 mb-1">{errors.username}</p>}

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm rounded focus:outline-none focus:border-green-500"
            />
            {errors.email && <p className="text-red-500 text-xs -mt-2 mb-1">{errors.email}</p>}

            {/* Phone Input */}
            <input
              type="text"
              placeholder="Enter your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm rounded focus:outline-none focus:border-green-500"
            />
            {errors.phone && <p className="text-red-500 text-xs -mt-2 mb-1">{errors.phone}</p>}

            {/* Password Input */}
            <InputGroup size="md" width="100%">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 px-4 py-2 text-sm rounded w-full focus:outline-none focus:border-green-500"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && <p className="text-red-500 text-xs -mt-2 mb-1">{errors.password}</p>}

            {/* Confirm Password Input */}
            <InputGroup size="md" width="100%" mb={0}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your Password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 px-4 py-2 text-sm rounded w-full focus:outline-none focus:border-green-500"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.confirmpassword && <p className="text-red-500 text-xs -mt-2 mb-1">{errors.confirmpassword}</p>}

            {/* Terms and Conditions */}
            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mr-2 text-green-500 focus:ring-green-500"
              />
              <span>
                I agree with your{' '}
                <a href="#" className="text-blue-500 underline">
                  terms & conditions
                </a>
              </span>
            </div>
            {errors.agreed && <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>}

            {/* Signup Button */}
            <Button
              colorScheme="green"
              onClick={handleSubmit}
              isLoading={isLoading} // Show loading spinner
              isDisabled={!agreed}
              className="w-full text-sm"
            >
              Signup
            </Button>

            <p className="text-xs text-center text-blue-500 mt-2">- OR -</p>

            {/* Google Signup Button */}
            <Button
              variant="outline"
              colorScheme="red"
              leftIcon={<AiOutlineGoogle />}
              onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/google-auth`}
              className="w-full text-sm"
            >
              Signup with Google
            </Button>

            <p className="text-sm text-center mt-4">
              Already have an account?{' '}
              <span
                className="text-green-500 font-bold cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </p>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default Signup;
