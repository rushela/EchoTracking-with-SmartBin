import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddFuelForm = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [liters, setLiters] = useState(0);
  const [costPerLiter, setCostPerLiter] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    // Vehicle ID validation (must be exactly "TR" followed by 3 digits, e.g., TR001)
    const vehicleIdRegex = /^TR\d{3}$/; // Must be "TR" followed by exactly 3 digits
    if (!vehicleIdRegex.test(vehicleId)) {
      toast({
        title: 'Invalid Vehicle ID',
        description: 'Vehicle ID must be exactly 5 characters long and start with "TR" followed by 3 digits (e.g., TR001).',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    // Driver ID validation (must start with "D" followed by digits)
    const driverIdRegex = /^D\d+$/;
    if (!driverIdRegex.test(driverId)) {
      toast({
        title: 'Invalid Driver ID',
        description: 'Driver ID must start with "D" followed by numbers (e.g., D001).',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    // Liters and Cost per Liter validation (both must be positive numbers)
    if (liters <= 0 || costPerLiter <= 0) {
      toast({
        title: 'Invalid Input',
        description: 'Liters and Cost per Liter must be positive numbers.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Validate form before proceeding
    if (!validateForm()) return;

    const totalCost = liters * costPerLiter;

    const response = await fetch('http://localhost:5000/api/fuel/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId, driverId, liters, costPerLiter, totalCost })
    });

    const data = await response.json();
    if (response.ok) {
      toast({
        title: 'Fuel record added successfully.',
        description: `Total cost: Rs. ${totalCost}`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      // Redirect to fuel table
      navigate('/fuel');
    } else {
      toast({
        title: 'Error adding fuel record',
        description: data.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="md">
      <FormControl mb={4}>
        <FormLabel>Vehicle ID</FormLabel>
        <Input
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          placeholder="e.g. TR001"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Driver ID</FormLabel>
        <Input
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          placeholder="e.g. D001"
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Liters</FormLabel>
        <NumberInput min={0} value={liters} onChange={(value) => setLiters(Number(value))}>
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Cost Per Liter</FormLabel>
        <NumberInput min={0} value={costPerLiter} onChange={(value) => setCostPerLiter(Number(value))}>
          <NumberInputField />
        </NumberInput>
      </FormControl>

      <Button colorScheme="green" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default AddFuelForm;
