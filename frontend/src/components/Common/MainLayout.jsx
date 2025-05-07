// src/components/MainLayout.jsx
import React from 'react';
import {
  Box,
  Flex,
  VStack,
  Button,
  Heading
} from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { name: 'Points',   path: '/points'   },
  { name: 'Fuel',     path: '/fuel'     },
  { name: 'Payments', path: '/payments' },
  { name: 'Reports',  path: '/reports'  },
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Flex minH="100vh" bg="gray.100">
      {/* Sidebar */}
      <Box
        w="220px"
        minH="100vh"            // full viewport height
        bg="green.600"
        color="white"
        boxShadow="md"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        position="sticky"       // stick as you scroll
        top="0"
      >
        <Box>
          <Heading size="md" mb={6}>
            Finance Dashboard
          </Heading>

          <VStack align="start" spacing={2}>
            {navItems.map(item => (
              <NavLink key={item.name} to={item.path}>
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    width="100%"
                    justifyContent="flex-start"
                    color="white"
                    bg={isActive ? 'green.700' : 'transparent'}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    _hover={{ bg: 'green.500' }}
                  >
                    {item.name}
                  </Button>
                )}
              </NavLink>
            ))}
          </VStack>
        </Box>

        {/* Logout */}
        <Button
          leftIcon={<FaSignOutAlt />}
          colorScheme="red"
          variant="solid"
          width="100%"
          justifyContent="flex-start"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        p={6}
        bg="gray.200"
        overflowY="auto"    // scroll only this panel
      >
        {children}
      </Box>
    </Flex>
  );
}
