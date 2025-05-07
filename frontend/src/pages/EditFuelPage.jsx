import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, NumberInput, NumberInputField,
  useToast, Spinner
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditFuelPage = () => {
  const { vehicleId } = useParams();
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFuel = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/fuel/all`);
        const found = res.data.find(f => f.vehicleId === vehicleId);
        setData(found);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load fuel data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchFuel();
  }, [vehicleId, toast]);

  const handleUpdate = async () => {
    const { driverId, liters, costPerLiter } = data;
    try {
      const res = await axios.put(`http://localhost:5000/api/fuel/${vehicleId}`, {
        driverId,
        liters,
        costPerLiter
      });
      if (res.status === 200) {
        toast({
          title: 'Updated',
          description: 'Fuel record updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/fuel');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update the fuel record.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!data) return <Spinner mt={10} color="green.500" />;

  return (
    <Box maxW="md" mx="auto" mt={10} bg="white" p={6} borderRadius="md" boxShadow="md">
      <FormControl mb={4}>
        <FormLabel>Vehicle ID</FormLabel>
        <Input value={data.vehicleId} isDisabled />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Driver ID</FormLabel>
        <Input
          value={data.driverId}
          onChange={(e) => setData({ ...data, driverId: e.target.value })}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Liters</FormLabel>
        <NumberInput value={data.liters} onChange={(val) => setData({ ...data, liters: Number(val) })}>
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Cost Per Liter</FormLabel>
        <NumberInput value={data.costPerLiter} onChange={(val) => setData({ ...data, costPerLiter: Number(val) })}>
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <Button colorScheme="green" onClick={handleUpdate}>Update Fuel Record</Button>
    </Box>
  );
};

export default EditFuelPage;
