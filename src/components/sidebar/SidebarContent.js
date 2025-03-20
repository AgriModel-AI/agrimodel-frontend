'use client'

import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
  Image,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

import NavItem from './NavItem';

import { FiHome, FiClipboard, FiActivity, FiHelpCircle, FiUsers, FiUser } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const MotionBox = motion(Box);

const LinkItems = [
  { name: 'Dashboard', icon: FiHome, url: '/dashboard' },
  { name: 'Diseases', icon: FiActivity, url: '/dashboard/diseases' },
  { name: 'Diagnosis Results', icon: FiClipboard, url: '/dashboard/diagnosis' },
  { name: 'Users', icon: FiUser, url: '/dashboard/clients' },
  { name: 'Community', icon: FiUsers, url: '/dashboard/community' },
  { name: 'Support Requests', icon: FiHelpCircle, url: '/dashboard/support' },
];

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();
  
  return (
    <MotionBox
      transition={{ duration: 0.3 }}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.100', 'gray.700')}
      w={{ base: 'full', md: 280 }} // Increased from 60 to 280px for desktop
      pos="fixed"
      h="full"
      boxShadow={{ base: 'none', md: 'sm' }}
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image src='../../assets/logoBlack.png' width={140} mt={2} />
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      <Box px={3} pb={5}>
        <Flex
          mt={2}
          mb={6}
          mx={4}
          p={3}
          bg="gray.50"
          borderRadius="xl"
          align="center"
          boxShadow="sm"
        >
          <Box
            bg="green.100"
            color="green.800"
            borderRadius="md"
            p={2}
            mr={3}
          >
            <FiActivity size={20} />
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">
              Today's Analysis
            </Text>
            <Text fontSize="md" fontWeight="semibold">
              124 Diagnoses
            </Text>
          </Box>
        </Flex>
        
        <Text
          px={4}
          pb={2}
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wider"
          color="gray.500"
        >
          Main Navigation
        </Text>
        
        <VStack spacing={1} align="stretch">
          {LinkItems.map((link, index) => (
            <MotionBox
              key={link.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavItem 
                as={Link} 
                icon={link.icon} 
                to={link.url} 
                bg={location.pathname === link.url ? 'rgba(49, 123, 64, 0.9)' : 'transparent'}
                color={location.pathname === link.url ? 'white' : 'inherit'}
                hoverColor={location.pathname === link.url ? 'white' : 'rgba(49, 123, 64, 0.9)'}
              >
                {link.name}
              </NavItem>
            </MotionBox>
          ))}
        </VStack>
        
        <Divider my={6} borderColor="gray.200" />
        
        <Text
          px={4}
          pb={2}
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wider"
          color="gray.500"
        >
          Account
        </Text>

        <NavItem 
          as={Link} 
          icon={FiUser} 
          to={"/dashboard/profile"} 
          bg={location.pathname === "/dashboard/profile" ? 'rgba(49, 123, 64, 0.9)' : 'transparent'}
          color={location.pathname === "/dashboard/profile" ? 'white' : 'inherit'}
          hoverColor={location.pathname === "/dashboard/profile" ? 'white' : 'rgba(49, 123, 64, 0.9)'}
        >
          My Profile
        </NavItem>
      </Box>
    </MotionBox>
  );
};

export default SidebarContent;