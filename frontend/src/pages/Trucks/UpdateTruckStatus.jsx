import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormLabel, Select, Spinner, VStack,
  useToast, Heading, Center, Text, Input
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateTruckStatus = () => {
  const [status, setStatus] = useState('');
  const [capacity, setCapacity] = useState('');
  const [driverId, setDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const { truckId } = useParams();

  useEffect(() => {
    async function loadTruck() {
      try {
        const res = await axios.get(`http://localhost:5000/api/trucks/get/${truckId}`);
        setStatus(res.data.status || 'active');
        setCapacity(res.data.capacity || '');
        setDriverId(res.data.driverId || '');
      } catch (error) {
        console.error('Error loading truck:', error);
        toast({
          title: 'Load Failed',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/trucks');
      } finally {
        setLoading(false);
      }
    }
    loadTruck();
  }, [truckId, toast, navigate]);

  useEffect(() => {
    async function loadDrivers() {
      try {
        const res = await axios.get('http://localhost:5000/api/drivers/list');
        setDrivers(res.data);
      } catch (error) {
        console.error('Error loading drivers:', error);
        toast({
          title: 'Load Failed',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    loadDrivers();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/trucks/update/${truckId}`, {
        status,
        driverId,
        capacity: Number(capacity)
      });
      toast({
        title: 'Truck updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/trucks');
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="#f5f5f5" display="flex" justifyContent="center" alignItems="center" p={6}>
      <Box bg="white" p={8} borderRadius="xl" boxShadow="2xl" w={{ base: "95%", md: "500px" }}>
        <Heading size="lg" color="green.600" textAlign="center" mb={4}>
          Update Truck Status 🚛
        </Heading>
        <Text fontSize="md" color="gray.600" mb={6} textAlign="center">
          Truck ID: <strong>{truckId}</strong>
        </Text>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <Box w="100%">
              <FormLabel>Status</FormLabel>
              <Select
                value={status}
                onChange={e => setStatus(e.target.value)}
                required
              >
                <option value="active">Active</option>
                <option value="in maintenance">In Maintenance</option>
              </Select>
            </Box>

            <Box w="100%">
              <FormLabel>Capacity (kg)</FormLabel>
              <Input
                type="number"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                required
                placeholder="Enter capacity in kg"
              />
            </Box>

            <Box w="100%">
              <FormLabel>Assign Driver</FormLabel>
              <Select
                value={driverId}
                onChange={e => setDriverId(e.target.value)}
              >
                <option value="">Select a driver</option>
                {drivers.map(d => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.driverId})
                  </option>
                ))}
              </Select>
            </Box>

            <Button type="submit" colorScheme="teal" w="100%">
              Update Truck
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default UpdateTruckStatus;
