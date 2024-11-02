'use client'

import {
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';

import NavItem from './NavItem';

import { FiHome, FiClipboard, FiActivity, FiHelpCircle, FiUsers, FiUser } from 'react-icons/fi';

const LinkItems = [
    { name: 'Dashboard', icon: FiHome, url: '/dashboard' },
    { name: 'Diseases', icon: FiActivity, url: '/dashboard/diseases' },
    { name: 'Diagnosis Results', icon: FiClipboard, url: '/dashboard/diagnosis' },
    { name: 'Clients', icon: FiUser, url: '/dashboard/clients' },
    { name: 'Community', icon: FiUsers, url: '/dashboard/community' },
    { name: 'Support', icon: FiHelpCircle, url: '/dashboard/support' },
  ]

const SidebarContent = ({ onClose, ...rest }) => {
    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue('white', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
        w={{ base: 'full', md: 60 }}
        pos="fixed"
        h="full"
        {...rest}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="black">
            AgriModel
          </Text>
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} url={link.url}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    )
  }

export default SidebarContent;