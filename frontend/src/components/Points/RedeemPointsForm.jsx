import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RedeemPointsForm = () => {
  const [userId, setUserId] = useState('');
  const [points, setPoints] = useState('');
  const [source, setSource] = useState('quiz');
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    // User ID validation: Cannot start with a number
    const userIdRegex = /^[^\d]/;
    if (!userIdRegex.test(userId)) {
      toast({
        title: 'Invalid User ID',
        description: 'User ID cannot start with a number.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    // Earned Points validation: Must be a valid, non-zero number
    if (!points || isNaN(points) || Number(points) <= 0) {
      toast({
        title: 'Invalid Points',
        description: 'Earned Points is required and must be a positive number.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleAddPoints = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/points/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points: Number(points), source })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Points Added',
          description: data.message || 'Points successfully added.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/points');
      } else {
        toast({
          title: 'Failed to Add Points',
          description: data.message || 'Something went wrong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      // now we're actually using the `error` variable
      console.error(error);
      toast({
        title: 'Server Error',
        description: 'Could not connect to the server.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="md">
      <FormControl mb={4}>
        <FormLabel>User ID</FormLabel>
        <Input
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Earned Points</FormLabel>
        <Input
          placeholder="Add Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Source of Points</FormLabel>
        <Select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="quiz">Quiz</option>
          <option value="correct disposal">Correct Disposal</option>
        </Select>
      </FormControl>

      <Button
        mt={4}
        colorScheme="green"
        onClick={handleAddPoints}
      >
        Add Points
      </Button>
    </Box>
  );
};

export default RedeemPointsForm;
