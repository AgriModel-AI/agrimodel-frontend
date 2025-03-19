'use client'

import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';

import SidebarContent from './SidebarContent';
import MobileNav from './MobileNav';
import { Outlet } from 'react-router-dom';



const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minH="100vh" className="bg-gray-100">
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }}/>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 72 }}  p="4" overflowY="auto" maxH="100vh" sx={{
          '&::-webkit-scrollbar': {
            display: 'none', // Hides scrollbar for Chrome, Safari, and Opera
          },
          msOverflowStyle: 'none', // Hides scrollbar for Internet Explorer and Edge
          scrollbarWidth: 'none', 
          paddingTop: '95px',
        }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default SidebarWithHeader;