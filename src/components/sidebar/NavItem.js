'use client'

import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionFlex = motion(Flex);

const NavItem = ({ icon, children, url, bg, color, hoverColor, ...rest }) => {
  return (
    <Box
      as="a"
      href={url}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="100%"
      mb={1}
    >
      <MotionFlex
        align="center"
        p="4"
        mx="4"
        borderRadius="xl"
        role="group"
        cursor="pointer"
        bg={bg}
        color={color}
        transition="all 0.2s ease"
        _hover={{
          bg: bg || '#49574c',
          color: hoverColor, // Force green text on hover
          transform: 'translateX(5px)',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="18"
            color={color}
            _groupHover={{
              color: hoverColor, // Force green icon on hover
            }}
            as={icon}
          />
        )}
        <Text 
          fontWeight={bg ? "semibold" : "medium"} 
          fontSize="15px"
          _groupHover={{
            color: hoverColor, // Force white text on hover
          }}
        >
          {children}
        </Text>
        {bg && (
          <Box
            ml="auto"
            h="8px"
            w="8px"
            borderRadius="full"
            bg="white"
          />
        )}
      </MotionFlex>
    </Box>
  );
};

export default NavItem;