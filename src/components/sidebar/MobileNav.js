'use client'

import {
    FiMenu,
    FiBell,
    FiChevronDown,
  } from 'react-icons/fi';

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
} from '@chakra-ui/react';
import {Badge} from "@nextui-org/react";
import { Link } from "react-router-dom";


const MobileNav = ({ onOpen, ...rest }) => {
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
  
        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold">
          AgriModel
        </Text>
  
        <HStack spacing={{ base: '0', md: '6' }}>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={0} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <Badge color="danger" content={5} isInvisible={false} shape="circle">
                  <FiBell size={20}/>
                </Badge>
              </MenuButton>
              <MenuList maxH="300px" w={"450px"} overflowY="auto" zIndex="1500">
                <Box px={4} py={2} borderBottom="1px" borderColor="gray.200" bg="gray.50" position="sticky" top={0} zIndex={1}>
                  <Text fontSize="lg" fontWeight="bold">Notifications</Text>
                </Box>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">🚀 Say goodbye to paper receipts!</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
                <MenuItem py={2}>
                  <Box>
                    <Text fontSize="base" fontWeight="semibold">📣 Edit your information</Text>
                    <Text fontSize="sm">Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.</Text>
                  </Box>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2">
                    <Text fontSize="sm">Justina Clark</Text>
                    <Text fontSize="xs" color="gray.600">
                      Admin
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}>
                <MenuItem as={Link} to="/dashboard/profile">Profile</MenuItem>
                <MenuDivider />
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    )
  }


export default MobileNav;