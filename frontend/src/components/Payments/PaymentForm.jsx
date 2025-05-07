import React, { useState } from 'react';
import {
  Box, Button, FormControl, FormLabel,
  Input, useToast, Center
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../Common/MainLayout';  // Import MainLayout

const PaymentForm = ({ onPaymentAdded }) => {
  const [driverId, setDriverId] = useState('');
  const [workingRides, setWorkingRides] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleDriverIdChange = async (e) => {
    const enteredDriverId = e.target.value;
    setDriverId(enteredDriverId);

    // Only fetch if at least something typed
    if (enteredDriverId.trim() !== "") {
      try {
        const response = await axios.get('http://localhost:5000/api/drivers/list');
        const driver = response.data.find(d => d.driverId === enteredDriverId);
        if (driver) {
          setWorkingRides(driver.workingRides);
        } else {
          setWorkingRides(''); // clear if driver not found
         
        }
      } catch (err) {
        console.error('Error fetching driver:', err);
        toast({
          title: 'Server Error',
          description: 'Could not fetch driver details.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } else {
      setWorkingRides(''); // if user clears Driver ID
    }
  };

  const validateForm = () => {
    // Driver ID validation: Make sure driver ID is not empty
    if (!driverId || driverId.trim() === '') {
      toast({
        title: 'Invalid Driver ID',
        description: 'Driver ID is required.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    // Working rides validation: Should not be empty or invalid
    if (!workingRides) {
      toast({
        title: 'Missing Data',
        description: 'Working rides data is not available for this driver.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/payments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          driverId,
          workingRides: parseInt(workingRides)
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast({
          title: 'Payment Processed',
          description: `Payment recorded for driver ${driverId}.`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setDriverId('');
        setWorkingRides('');
        if (onPaymentAdded) {
          onPaymentAdded();
        }
        // Redirect to Payment Table after submission
        navigate('/payments');
      } else {
        toast({
          title: 'Payment Failed',
          description: data.message || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    } catch (err) {
      console.error('Payment error', err);
      toast({ title: 'Server error', status: 'error' });
    }
  };

  return (
    <MainLayout>  {/* Wrap the PaymentForm with MainLayout */}
      <Center h="100vh">
        <Box bg="white" p={6} borderRadius="md" boxShadow="md" width="100%" maxWidth="400px">
          <FormControl mb={4}>
            <FormLabel>Driver ID</FormLabel>
            <Input
              value={driverId}
              onChange={handleDriverIdChange}
              placeholder="Enter Driver ID"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Working Rides</FormLabel>
            <Input
              value={workingRides}
              isDisabled // Disable typing manually
              placeholder="Working rides will appear here"
            />
          </FormControl>

          <Button colorScheme="green" onClick={handleSubmit} isDisabled={!driverId}>
            Process Payment
          </Button>
        </Box>
      </Center>
    </MainLayout>
  );
};

export default PaymentForm;
