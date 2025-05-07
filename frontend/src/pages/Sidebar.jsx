import React from 'react';
import { Box, Flex, Text, VStack, Button } from "@chakra-ui/react";
import { FaTruck, FaTrash, FaUserAlt, FaBuilding, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user authentication (adjust if using tokens)
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box
      width="250px"
      minHeight="100vh"
      bgGradient="linear(to-b, #2F7D32, #38a169)"
      color="white"
      p={6}
      boxShadow="lg"
      position="fixed"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Flex direction="column" align="start" gap={8}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          ♻️ Recycling Center Manager
        </Text>

        <VStack align="start" spacing={4} width="100%">
          <NavLink to="/bins" style={{ width: "100%" }}>
            <Button
              leftIcon={<FaTrash />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              _hover={{ bg: "green.500" }}
            >
              Bins
            </Button>
          </NavLink>

          <NavLink to="/trucks" style={{ width: "100%" }}>
            <Button
              leftIcon={<FaTruck />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              _hover={{ bg: "green.500" }}
            >
              Trucks
            </Button>
          </NavLink>

          <NavLink to="/drivers" style={{ width: "100%" }}>
            <Button
              leftIcon={<FaUserAlt />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              _hover={{ bg: "green.500" }}
            >
              Drivers
            </Button>
          </NavLink>

          <NavLink to="/centers" style={{ width: "100%" }}>
            <Button
              leftIcon={<FaBuilding />}
              variant="ghost"
              width="100%"
              justifyContent="flex-start"
              color="white"
              _hover={{ bg: "green.500" }}
            >
              Centers
            </Button>
          </NavLink>
        </VStack>
      </Flex>

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
  );
}