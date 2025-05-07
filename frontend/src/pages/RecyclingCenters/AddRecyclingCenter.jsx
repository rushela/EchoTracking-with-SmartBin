import React, { useState } from 'react';
import {
  Box, Button, FormLabel, Input, Textarea, VStack, useToast,
  FormControl, FormErrorMessage, Select, Center, Heading, Text
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecyclingCenter = () => {
  const [form, setForm] = useState({
    centerId: '',
    name: '',
    location: '',
    operationalHours: '8:00 am - 5:00 pm', // Default dropdown value
    materialsAccepted: '',
    contactNumber: ''
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Regex to allow only letters, numbers, spaces, and basic punctuation
  const validateText = (value) => {
    const regex = /^[a-zA-Z0-9\s,.-]*$/;
    return regex.test(value);
  };

  const validatePhone = (value) => {
    const isValid = /^\d{10}$/.test(value);
    setErrors(prev => ({
      ...prev,
      contactNumber: isValid ? '' : 'Contact number must be exactly 10 digits'
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If name or location field, check for special characters
    if ((name === "name" || name === "location") && !validateText(value)) {
      setErrors(prev => ({
        ...prev,
        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} should only contain letters, numbers, and basic punctuation.`
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setForm({ ...form, [name]: value });

    if (name === "contactNumber") {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.contactNumber) {
      toast({ title: 'Please fix validation errors', status: 'error' });
      return;
    }

    try {
      const payload = {
        ...form,
        materialsAccepted: form.materialsAccepted.split(',').map(item => item.trim())
      };

      await axios.post('http://localhost:5000/api/recycling-centers/register', payload);
      toast({ title: 'Center added', status: 'success', duration: 3000 });
      navigate('/centers');
    } catch (error) {
      toast({ title: 'Error adding center', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="#f5f5f5"
      p={6}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "500px" }}
      >
        <Heading size="lg" color="green.600" mb={6} textAlign="center">
          Add New Recycling Center ♻️
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormLabel>Center ID</FormLabel>
            <Input name="centerId" value={form.centerId} onChange={handleChange} required placeholder="Enter Center ID" focusBorderColor="green.500" />

            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} required placeholder="Enter name" focusBorderColor="green.500" />
            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}

            <FormLabel>Location</FormLabel>
            <Input name="location" value={form.location} onChange={handleChange} required placeholder="Enter location" focusBorderColor="green.500" />
            {errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage>}

            <FormLabel>Operational Hours</FormLabel>
            <Select
              name="operationalHours"
              value={form.operationalHours}
              onChange={handleChange}
              required
              focusBorderColor="green.500"
            >
              <option value="8:00 am - 5:00 pm">8:00 am - 5:00 pm</option>
              <option value="9:00 am - 6:00 pm">9:00 am - 6:00 pm</option>
              <option value="10:00 am - 7:00 pm">10:00 am - 7:00 pm</option>
            </Select>

            <FormLabel>Materials Accepted (comma separated)</FormLabel>
            <Textarea name="materialsAccepted" value={form.materialsAccepted} onChange={handleChange} required placeholder="Enter materials" focusBorderColor="green.500" />

            <FormControl isInvalid={!!errors.contactNumber} isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter contact number"
                focusBorderColor="green.500"
              />
              <FormErrorMessage>{errors.contactNumber}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" width="100%">
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default AddRecyclingCenter;
