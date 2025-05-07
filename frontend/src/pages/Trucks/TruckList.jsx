import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, Button,
  Heading, useToast, Spinner, Flex, Text, Center
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TruckList = () => {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTrucks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/trucks/list');
      setTrucks(res.data);
    } catch (error) {
      console.error('Error loading trucks:', error);
      toast({
        title: 'Failed to load trucks',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTrucks();
  }, [fetchTrucks]);

  const deleteTruck = async (truckId) => {
    if (!window.confirm('Delete this truck?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/trucks/delete/${truckId}`);
      toast({
        title: 'Deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      await fetchTrucks();
    } catch (error) {
      console.error('Error deleting truck:', error);
      toast({
        title: 'Delete failed',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg="#f5f5f5" p={6} display="flex" justifyContent="center">
      <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl" w={{ base: "95%", md: "90%" }}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="green.600">Truck Management 🚛</Heading>
          <Button as={Link} to="/trucks/add" colorScheme="teal" borderRadius="full">
            + Add Truck
          </Button>
        </Flex>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" color="green.500" />
          </Center>
        ) : trucks.length === 0 ? (
          <Text textAlign="center" color="gray.500">No trucks available.</Text>
        ) : (
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead bg="green.600">
              <Tr>
                <Th color="white">Truck ID</Th>
                <Th color="white">Capacity (kg)</Th>
                <Th color="white">Status</Th>
                <Th color="white" textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {trucks.map(truck => (
                <Tr key={truck.truckId}>
                  <Td>{truck.truckId}</Td>
                  <Td>{truck.capacity}</Td>
                  <Td>{truck.status || 'Pending'}</Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <Button
                        as={Link}
                        to={`/trucks/update/${truck.truckId}`}
                        size="sm"
                        colorScheme="blue"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => deleteTruck(truck.truckId)}
                        size="sm"
                        colorScheme="red"
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

export default TruckList;
