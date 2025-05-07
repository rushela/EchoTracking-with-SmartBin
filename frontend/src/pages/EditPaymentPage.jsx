// src/pages/EditPaymentPage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPaymentPage = () => {
  // ← pull `id` from the route and rename to `driverId`
  const { id: driverId } = useParams();
  const [workingDays, setWorkingDays] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast    = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments/all');
        const payment = response.data.find(p => p.driverId === driverId);
        if (payment) {
          setWorkingDays(payment.workingDays ?? '');
        } else {
          toast({
            title: 'Not Found',
            description: 'Payment record not found.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          navigate('/payments');
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Failed to load payment data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [driverId, toast, navigate]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/payments/${driverId}`,
        { workingDays: Number(workingDays) }
      );
      if (res.status === 200) {
        toast({
          title: 'Updated',
          description: 'Payment updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/payments');
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Spinner mt={10} color="green.500" />;
  }

  return (
    <Box maxW="md" mx="auto" mt={10} bg="white" p={6} borderRadius="md" boxShadow="md">
      <FormControl mb={4}>
        <FormLabel>Driver ID</FormLabel>
        <Input value={driverId} isDisabled />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Working Rides</FormLabel>
        <NumberInput
          min={1}
          value={workingDays}
          onChange={(val) => setWorkingDays(val)}
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <Button colorScheme="green" onClick={handleUpdate}>
        Update Payment
      </Button>
    </Box>
  );
};

export default EditPaymentPage;
