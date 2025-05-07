import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormLabel, Input, VStack, useToast,
  FormControl, FormErrorMessage, Spinner, Heading
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditDriver = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    driverId: '',
    name: '',
    contactNumber: '',
    licenseNumber: '',
    workingRides: 0
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/drivers/list');
        const driver = res.data.find(d => d.driverId === id);
        if (driver) {
          setForm({
            driverId: driver.driverId,
            name: driver.name,
            contactNumber: driver.contactNumber,
            licenseNumber: driver.licenseNumber,
            workingRides: driver.workingRides || 0
          });
        } else {
          toast({
            title: 'Driver not found',
            status: 'error',
            duration: 3000,
            isClosable: true
          });
          navigate('/drivers');
        }
      } catch (error) {
        toast({
          title: 'Error loading driver',
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        navigate('/drivers');
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [id, toast, navigate]);

  const validatePhone = (value) => {
    const isValid = /^\d{10}$/.test(value);
    setErrors(prev => ({
      ...prev,
      contactNumber: isValid ? '' : 'Contact number must be exactly 10 digits'
    }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'contactNumber') {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(form.contactNumber)) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before submitting',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/drivers/update/${id}`, form);
      toast({
        title: 'Success',
        description: 'Driver updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/drivers');
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update driver',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <Spinner size="xl" color="green.500" />
      </Box>
    );
  }

  return (
    <Box p={6} display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="#f5f5f5">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "500px" }}
        transition="all 0.3s ease"
      >
        <Heading size="lg" color="green.600" textAlign="center" mb={6}>
          Edit Driver 🚛
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Driver ID</FormLabel>
              <Input
                name="driverId"
                value={form.driverId}
                isDisabled
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              />
            </FormControl>

            <FormControl>
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
            </FormControl>

            <FormControl isInvalid={!!errors.contactNumber}>
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
              <FormErrorMessage>{errors.contactNumber}</FormErrorMessage>
            </FormControl>

            <FormControl>
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
            </FormControl>

            <FormControl>
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
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="100%"
              borderRadius="lg"
              size="lg"
              _hover={{ bg: 'green.600' }}
            >
              Update Driver
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default EditDriver;
