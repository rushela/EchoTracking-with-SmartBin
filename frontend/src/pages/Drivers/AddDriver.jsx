import React, { useState } from 'react';
import {
  Box, Button, FormLabel, Input, VStack, useToast, FormControl, FormErrorMessage, Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDriver = () => {
  const [form, setForm] = useState({
    driverId: '',
    name: '',
    contactNumber: '',
    licenseNumber: '',
    workingRides: 0
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validatePhone = (value) => {
    const isValid = /^\d{10}$/.test(value);
    setErrors(prev => ({
      ...prev,
      contactNumber: isValid ? '' : 'Contact number must be exactly 10 digits'
    }));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "contactNumber") {
      validatePhone(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.contactNumber) {
      toast({ title: 'Please fix validation errors', status: 'error' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/drivers/add', form);
      toast({ title: 'Driver added', status: 'success' });
      navigate('/drivers');
    } catch (error) {
      toast({ title: 'Error adding driver', status: 'error' });
    }
  };
  

  return (
    <Box p={6} display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="#f5f5f5">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "500px" }}
        transition="all 0.3s ease"
        _hover={{ boxShadow: 'xl', transform: 'scale(1.05)' }}
      >
        <FormLabel textAlign="center" fontSize="2xl" color="green.600">Add New Driver 🛻</FormLabel>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormLabel>Driver ID</FormLabel>
            <Input
              name="driverId"
              value={form.driverId}
              onChange={handleChange}
              required
              placeholder="Enter Driver ID"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter Driver's Name"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Contact Number</FormLabel>
            <Input
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              placeholder="Enter Contact Number"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />
            {errors.contactNumber && <FormErrorMessage>{errors.contactNumber}</FormErrorMessage>}

            <FormLabel>License Number</FormLabel>
            <Input
              name="licenseNumber"
              value={form.licenseNumber}
              onChange={handleChange}
              required
              placeholder="Enter License Number"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Working Rides</FormLabel>
            <Input
              name="workingRides"
              type="number"
              value={form.workingRides}
              onChange={handleChange}
              placeholder="Enter Working Rides"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
              min="0"
            />

            <Button type="submit" colorScheme="teal" width="100%" borderRadius="lg" size="lg" _hover={{ bg: 'green.600' }}>
              Add Driver
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AddDriver;
