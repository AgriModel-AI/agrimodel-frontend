'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FiMenu, FiBell, FiChevronDown } from 'react-icons/fi';

import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Image,
} from '@chakra-ui/react';
import { Badge } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserDetails } from '../../redux/slices/userDetailsSlice';
import { logout } from '../../redux/slices/userSlice';

const MobileNav = ({ onOpen, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const loading = useSelector((state) => state.userDetails.loading);
  const hasFetched = useSelector((state) => state.userDetails.hasFetched);

  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const cancelRef = useRef();

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, hasFetched]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [imageSrc, setImageSrc] = useState('');
  const [imageHash, setImageHash] = useState(Date.now());

  useEffect(() => {
    if (!loading && userDetails.profilePicture) {
      setImageSrc(userDetails.profilePicture);
      setImageHash(Date.now()); // Update hash to force refresh
    }
  }, [loading, userDetails.profilePicture]);

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      {/* <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        AgriModel
      </Text> */}
      <Image src='../../assets/logo_black.png' width={130} display={{ base: 'flex', md: 'none' }}/>
      

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={0} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <Badge color="danger" content={5} isInvisible={false} shape="circle">
                <FiBell size={20} />
              </Badge>
            </MenuButton>
            <MenuList maxH="300px" w={"450px"} overflowY="auto" zIndex="1500">
              <Box px={4} py={2} borderBottom="1px" borderColor="gray.200" bg="gray.50" position="sticky" top={0} zIndex={1}>
                <Text fontSize="lg" fontWeight="bold">Notifications</Text>
              </Box>
              {/* Notifications list */}
              {[...Array(5)].map((_, index) => (
                <MenuItem key={index} py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
              <Avatar
                  src={`${userDetails.profilePicture}`}
                  key={imageHash}
                  alt="Profile"
                  size='sm'
                  referrerPolicy="no-referrer" 
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">
                    {loading 
                      ? 'loading ..' 
                      : userDetails.names 
                        ? userDetails.names 
                        : userDetails.email?.split("@")[0] || "Guest"}
                  </Text>

                  <Text fontSize="xs" color="gray.600">
                    {loading ? 'loading ..' : userDetails.role}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg={useColorModeValue('white', 'gray.900')} borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem as={Link} to="/dashboard/profile">Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => setLogoutDialogOpen(true)}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setLogoutDialogOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sign Out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to sign out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default MobileNav;
