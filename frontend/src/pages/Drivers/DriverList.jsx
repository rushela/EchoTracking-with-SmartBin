import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Button,
  Heading,
  Text,
  Center,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/drivers/list");
      setDrivers(res.data);
    } catch (err) {
      toast({
        title: "Failed to load drivers",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/drivers/delete/${id}`);
      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchDrivers(); // refresh list
    } catch (err) {
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <Box p={6} bg="#f5f5f5" minHeight="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "95%", md: "80%" }}
        mx="auto"
      >
        {/* Title & Add Button */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="teal.600">
            Driver Management 🛻
          </Heading>
          <Button
            as={Link}
            to="/drivers/add"
            colorScheme="teal"
            borderRadius="full"
            _hover={{ transform: "scale(1.05)" }}
          >
            + Add Driver
          </Button>
        </Flex>

        {/* Spinner or Table */}
        {loading ? (
          <Center>
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : drivers.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No drivers available.
          </Text>
        ) : (
          <Table variant="striped" colorScheme="gray">
            <Thead bg="green.600">
              <Tr>
                <Th color="white">Driver ID</Th>
                <Th color="white">Name</Th>
                <Th color="white">License Number</Th>
                <Th color="white">Contact</Th>
                <Th color="white">Working Rides</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {drivers.map((driver) => (
                <Tr key={driver.driverId} _hover={{ bg: "#f0fdf4" }}>
                  <Td>{driver.driverId}</Td>
                  <Td>{driver.name}</Td>
                  <Td>{driver.licenseNumber}</Td>
                  <Td>{driver.contactNumber}</Td>
                  <Td>{driver.workingRides || 0}</Td>
                  <Td>
                    <Flex justify="start" gap={2}>
                      <Button
                        as={Link}
                        to={`/drivers/edit/${driver.driverId}`}
                        colorScheme="blue"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => deleteDriver(driver.driverId)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default DriverList;
