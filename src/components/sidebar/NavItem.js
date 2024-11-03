'use client'

import {
  Box,
  Flex,
  Icon,
} from '@chakra-ui/react';

const NavItem = ({ icon, children, url, ...rest }) => {
    return (
      <Box
        as="a"
        href={url}
        style={{ textDecoration: 'none' }}
        _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: '#49574c',
            color: 'white',
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Box>
    )
  }


export default NavItem;