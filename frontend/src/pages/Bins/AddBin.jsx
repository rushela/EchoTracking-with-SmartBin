import React, { useState } from 'react';
import {
  Box, Button, FormLabel, Input, NumberInput, NumberInputField, VStack, useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBin = () => {
  const [form, setForm] = useState({ binId: '', location: '', type: '', fillLevel: 0 });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bins/add', form);
      toast({ title: 'Bin added', status: 'success' });
      navigate('/bins');
    } catch {
      toast({ title: 'Add failed', status: 'error' });
    }
  };

  return (
    <Box p={5} bg="#f5f5f5" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "500px" }}
        transition="all 0.3s ease"
        _hover={{ boxShadow: 'xl', transform: 'scale(1.05)' }}
      >
        <FormLabel textAlign="center" fontSize="2xl" color="green.600">Add New Bin</FormLabel>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormLabel>Bin ID</FormLabel>
            <Input
              name="binId"
              value={form.binId}
              onChange={handleChange}
              required
              placeholder="Enter Bin ID"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Enter Location"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Type</FormLabel>
            <Input
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              placeholder="Enter Bin Type"
              focusBorderColor="green.500"
              borderRadius="lg"
              size="lg"
            />

            <FormLabel>Fill Level (%)</FormLabel>
            <NumberInput value={form.fillLevel} min={0} max={100} onChange={(val) => setForm({ ...form, fillLevel: Number(val) })}>
              <NumberInputField placeholder="Enter fill level" />
            </NumberInput>

            <Button type="submit" colorScheme="teal" width="100%" borderRadius="lg" size="lg" _hover={{ bg: 'green.600' }}>
              Add Bin
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AddBin;
