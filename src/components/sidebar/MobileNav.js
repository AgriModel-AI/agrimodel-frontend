'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { FiMenu, FiBell, FiLogOut, FiChevronDown, FiUser } from 'react-icons/fi';

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
  Divider,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { Link, useNavigate } from "react-router-dom";
import { fetchUserDetails } from '../../redux/slices/userDetailsSlice';
import { logout } from '../../redux/slices/userSlice';
import { fetchNotifications, markNotificationsAsRead } from '../../redux/slices/notificationSlice';
import { formatDate } from '../../utils/dateUtil';
import { useToast } from "@chakra-ui/react";
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);
const MotionMenuItem = motion(MenuItem);

const MobileNav = ({ onOpen, ...rest }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const userDetails = useSelector((state) => state.userDetails.userDetails);
  const loading = useSelector((state) => state.userDetails.loading);
  const hasFetched = useSelector((state) => state.userDetails.hasFetched);

  const {notifications, hasFetched: hasFetchedNotification } = useSelector((state) => state.notifications);

  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const cancelRef = useRef();

  useEffect(() => {
    // Create a socket connection
    const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('jwtToken'),
      },
      reconnection: true,
    });

    // Listen for events from the server
    socket.on('new_notification', (data) => {
      dispatch(fetchNotifications());
      toast({
        title: "New notification",
        status: "info",
        position: 'top',
        duration: 3000,
        isClosable: true,
      });
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, toast]);

  useEffect(() => {
    if (!hasFetchedNotification) {
      dispatch(fetchNotifications());
    }
  }, [dispatch, hasFetchedNotification]);

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

  const handleNotification = async() => {
      setIsNotificationOpen(!isNotificationOpen);
      setIsMenuOpen(false);
  }

  const handleNotificationRead = async() => {
    try {
      await dispatch(markNotificationsAsRead());
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Flex
      position="fixed"
      top="0"
      left={0}
      right={0}
      ml={{ base: 0, md: 280 }} // Updated from 60 to 280 to match sidebar width
      px={{ base: 4, md: 6 }}
      height="20"
      zIndex="30"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.100', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      boxShadow="sm"
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="ghost"
        aria-label="open menu"
        icon={<FiMenu size={20} />}
        _hover={{ bg: 'gray.100' }}
      />

      <Image 
        src='../../assets/logo_black.png' 
        width={130} 
        display={{ base: 'flex', md: 'none' }}
        mt={1}
      />
      
      <HStack spacing={{ base: '3', md: '6' }}>
        <Tooltip label="Notifications" hasArrow placement="bottom">
          <Box position="relative">
            <IconButton
              aria-label="Notifications"
              icon={
                <>
                  <FiBell size={20} />
                  {/* {notifications.filter(notification => !notification.isRead).length > 0 && (
                    <Box
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      bg="red.500"
                      color="white"
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight="bold"
                      w="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="2px solid white"
                    >
                      {notifications.filter(notification => !notification.isRead).length}
                    </Box>
                  )} */}
                </>
              }
              variant="ghost"
              _hover={{ bg: 'gray.100' }}
              onClick={handleNotification}
            />
            
            {notifications.filter(notification => !notification.isRead).length > 0 && (
              <Box
                position="absolute"
                top="5px"
                right="5px"
                transform="translate(25%, -25%)"
              >
                <Box
                  as={motion.div}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [0.5, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  fontWeight="bold"
                  px={1}
                  border="2px solid white"
                  boxShadow="0 2px 5px rgba(0,0,0,0.2)"
                >
                  {notifications.filter(notification => !notification.isRead).length}
                </Box>
              </Box>
            )}
  
            {/* Redesigned Notification Panel */}
            <AnimatePresence>
              {isNotificationOpen && (
                <MotionBox
                  position="absolute"
                  top="45px"
                  right="-100px"
                  width="380px"
                  zIndex={1500}
                  boxShadow="xl"
                  bg="white"
                  borderRadius="xl"
                  overflow="hidden"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <Flex 
                    px={4} 
                    py={3} 
                    borderBottom="1px" 
                    borderColor="gray.200" 
                    bg="gray.50" 
                    justify="space-between" 
                    align="center"
                  >
                    <Flex align="center">
                      <Box 
                        bg="green.100" 
                        p={1.5} 
                        borderRadius="md" 
                        color="green.600" 
                        mr={2}
                      >
                        <FiBell size={14} />
                      </Box>
                      <Text fontSize="md" fontWeight="semibold">Notifications</Text>
                      <Box 
                        ml={2} 
                        bg="gray.500" 
                        color="white" 
                        borderRadius="full" 
                        px={2} 
                        py={0.5} 
                        fontSize="xs"
                      >
                        {notifications.length}
                      </Box>
                    </Flex>
                    
                    <Button 
                      size="xs" 
                      colorScheme="green" 
                      variant="ghost" 
                      fontWeight="medium"
                      leftIcon={<Icon as={FiBell} size="sm" />}
                      onClick={handleNotificationRead}
                    >
                      Mark all read
                    </Button>
                  </Flex>
                  
                  {/* Notification List */}
                  <Box maxH="400px" overflowY="auto" py={2}>
                    {notifications.length === 0 ? (
                      <Box p={8} textAlign="center">
                        <Box 
                          mx="auto" 
                          mb={4} 
                          bg="gray.100" 
                          w="60px" 
                          h="60px" 
                          borderRadius="full" 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="center"
                        >
                          <FiBell size={24} color="#A0AEC0" />
                        </Box>
                        <Text fontWeight="medium" color="gray.500">No notifications yet</Text>
                        <Text fontSize="sm" color="gray.400" mt={1}>
                          We'll notify you when something arrives
                        </Text>
                      </Box>
                    ) : (
                      notifications.map((notification, index) => (
                        <MotionBox 
                          key={notification.notificationId}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "gray.50" }}
                        >
                          <Flex 
                            px={4} 
                            py={3}
                            borderLeft="4px solid" 
                            borderLeftColor={!notification.isRead ? "green.400" : "transparent"}
                            position="relative"
                            overflow="hidden"
                            cursor="pointer"
                          >
                            {/* Notification Item - Redesigned */}
                            {!notification.isRead && (
                              <Box 
                                position="absolute" 
                                top={0} 
                                left={0} 
                                bottom={0} 
                                w="1px" 
                                bg="green.400" 
                              />
                            )}
                            
                            {/* Left: Icon with status */}
                            <Flex 
                              mr={3} 
                              h="38px" 
                              w="38px" 
                              bg={!notification.isRead ? "green.100" : "gray.100"} 
                              borderRadius="lg" 
                              justify="center" 
                              align="center"
                              flexShrink={0}
                            >
                              <Box color={!notification.isRead ? "green.500" : "gray.500"}>
                                <FiBell size={18} />
                              </Box>
                            </Flex>
                            
                            {/* Center: Content */}
                            <Box flex="1">
                              <Flex align="center" mb={0.5}>
                                <Text fontSize="sm" fontWeight={!notification.isRead ? "semibold" : "medium"} noOfLines={1}>
                                  Notification #{notification.notificationId}
                                </Text>
                                {!notification.isRead && (
                                  <Box 
                                    ml={2} 
                                    bg="green.100" 
                                    color="green.600" 
                                    borderRadius="full" 
                                    px={1.5} 
                                    py={0.5} 
                                    fontSize="sm" 
                                    fontWeight="medium"
                                  >
                                    NEW
                                  </Box>
                                )}
                              </Flex>
                              <Text 
                                fontSize="sm" 
                                color={!notification.isRead ? "gray.700" : "gray.500"} 
                                fontWeight={!notification.isRead ? "medium" : "normal"}
                                noOfLines={2}
                              >
                                {notification.message}
                              </Text>
                              
                              {/* Time */}
                              <Text fontSize="xs" color="gray.400" mt={1}>
                                {formatDate(notification.timestamp)}
                              </Text>
                            </Box>
                          </Flex>
                          
                          {index < notifications.length - 1 && (
                            <Divider borderColor="gray.100" />
                          )}
                        </MotionBox>
                      ))
                    )}
                  </Box>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </Tooltip>
        
        <Menu
          onOpen={() => setIsMenuOpen(true)}
          onClose={() => setIsMenuOpen(false)}
        >
          <MenuButton
            py={2}
            transition="all 0.3s"
            _focus={{ boxShadow: 'none' }}
            borderRadius="full"
            _hover={{ bg: 'gray.100' }}
            px={2}
          >
            <HStack spacing={2}>
              <Avatar
                src={`${userDetails.profilePicture}`}
                key={imageHash}
                alt="Profile"
                size='sm'
                referrerPolicy="no-referrer"
                border="2px solid"
                borderColor={isMenuOpen ? "green.400" : "transparent"}
                transition="all 0.2s"
              />
              <VStack
                display={{ base: 'none', md: 'flex' }}
                alignItems="flex-start"
                spacing="1px"
                ml="2">
                <Text fontSize="sm" fontWeight="medium">
                  {loading 
                    ? 'loading ..' 
                    : userDetails.names 
                      ? userDetails.names 
                      : userDetails.email?.split("@")[0] || "Guest"}
                </Text>

                <Text fontSize="xs" color="gray.500">
                  {loading ? 'loading ..' : userDetails.role}
                </Text>
              </VStack>
              <Box display={{ base: 'none', md: 'flex' }}>
                <FiChevronDown 
                  style={{ 
                    transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s' 
                  }} 
                />
              </Box>
            </HStack>
          </MenuButton>
          
          <MenuList
            bg={useColorModeValue('white', 'gray.900')}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            boxShadow="lg"
            borderRadius="xl"
            p={2}
            minW="220px"
          >
            <MotionMenuItem
              as={Link}
              to="/dashboard/profile"
              fontSize="sm"
              fontWeight="medium"
              p={3}
              borderRadius="lg"
              _hover={{ bg: 'gray.100' }}
              whileHover={{ x: 5 }}
            >
              <Flex align="center">
                <Box mr={3} color="gray.600">
                  <FiUser size={16} />
                </Box>
                <Text>Profile Settings</Text>
              </Flex>
            </MotionMenuItem>
            
            <MenuDivider my={2} />
            
            <MotionMenuItem
              fontSize="sm"
              fontWeight="medium"
              p={3}
              borderRadius="lg"
              color="red.500"
              _hover={{ bg: 'red.50' }}
              onClick={() => setLogoutDialogOpen(true)}
              whileHover={{ x: 5 }}
            >
              <Flex align="center">
                <Box mr={3}>
                  <FiLogOut size={16} />
                </Box>
                <Text>Sign out</Text>
              </Flex>
            </MotionMenuItem>
          </MenuList>
        </Menu>
      </HStack>
      

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setLogoutDialogOpen(false)}
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl" boxShadow="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sign Out
            </AlertDialogHeader>

            <AlertDialogBody pb={6}>
              Are you sure you want to sign out of your account?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setLogoutDialogOpen(false)}
                fontWeight="medium"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleLogout}
                ml={3}
                leftIcon={<FiLogOut size={16} />}
                fontWeight="medium"
              >
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