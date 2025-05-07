import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormLabel, Input, Textarea, VStack, useToast, Spinner,
  Select, FormControl, FormErrorMessage, Heading, Center
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditRecyclingCenter = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
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
    return isValid;
  };

  // Fetch center by centerId
  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/recycling-centers/list');
        const center = res.data.find(c => c.centerId === id);
        if (center) {
          setForm({
            ...center,
            materialsAccepted: Array.isArray(center.materialsAccepted) 
              ? center.materialsAccepted.join(', ')
              : center.materialsAccepted
          });
        } else {
          toast({ 
            title: 'Center not found', 
            status: 'error',
            duration: 3000,
            isClosable: true 
          });
          navigate('/centers');
        }
      } catch (error) {
        toast({ 
          title: 'Error fetching data', 
          description: error.response?.data?.message || error.message,
          status: 'error',
          duration: 3000,
          isClosable: true 
        });
      }
    };
    fetchCenter();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate text fields
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

    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "contactNumber") {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.contactNumber || errors.name || errors.location) {
      toast({ 
        title: 'Please fix validation errors', 
        status: 'error',
        duration: 3000,
        isClosable: true 
      });
      return;
    }

    try {
      const updatedData = {
        ...form,
        materialsAccepted: form.materialsAccepted.split(',').map(item => item.trim())
      };

      await axios.put(`http://localhost:5000/api/recycling-centers/update/${id}`, updatedData);
      toast({ 
        title: 'Center updated successfully', 
        status: 'success',
        duration: 3000,
        isClosable: true 
      });
      navigate('/centers');
    } catch (error) {
      toast({ 
        title: 'Error updating center', 
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true 
      });
    }
  };

  if (!form) return (
    <Center minH="100vh">
      <Spinner size="xl" color="green.500" />
    </Center>
  );

  return (
    <Box p={5} display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bg="#f5f5f5">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "500px" }}
        transition="all 0.3s ease"
      >
        <Heading size="lg" color="green.600" mb={6} textAlign="center">
          Edit Recycling Center ♻️
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Center ID (read-only)</FormLabel>
              <Input 
                value={form.centerId} 
                isReadOnly 
                focusBorderColor="green.500" 
                placeholder="Center ID" 
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter name"
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              />
              {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.location}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              />
              {errors.location && <FormErrorMessage>{errors.location}</FormErrorMessage>}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Operational Hours</FormLabel>
              <Select
                name="operationalHours"
                value={form.operationalHours}
                onChange={handleChange}
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              >
                <option value="8:00 am - 5:00 pm">8:00 am - 5:00 pm</option>
                <option value="9:00 am - 6:00 pm">9:00 am - 6:00 pm</option>
                <option value="10:00 am - 7:00 pm">10:00 am - 7:00 pm</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Materials Accepted (comma separated)</FormLabel>
              <Textarea
                name="materialsAccepted"
                value={form.materialsAccepted}
                onChange={handleChange}
                placeholder="Enter materials"
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.contactNumber}>
              <FormLabel>Contact Number</FormLabel>
              <Input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter contact number"
                focusBorderColor="green.500"
                borderRadius="lg"
                size="lg"
              />
              {errors.contactNumber && <FormErrorMessage>{errors.contactNumber}</FormErrorMessage>}
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="teal" 
              width="100%" 
              borderRadius="lg" 
              size="lg" 
              _hover={{ bg: 'green.600' }}
            >
              Update
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default EditRecyclingCenter;
