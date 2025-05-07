import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, useToast, Spinner
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPointsPage = () => {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/points/${userId}`);
        setData(res.data);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchPoints();
  }, [userId, toast]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/points/update/${userId}`, data);
      if (res.status === 200) {
        toast({
          title: 'Updated',
          description: 'Points updated successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/points');
      }
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Could not update the record.',
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
        <FormLabel>User ID</FormLabel>
        <Input value={data.userId} isDisabled />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Points</FormLabel>
        <Input
          type="number"
          value={data.points}
          onChange={(e) => setData({ ...data, points: e.target.value })}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Source</FormLabel>
        <Select
          value={data.source}
          onChange={(e) => setData({ ...data, source: e.target.value })}
        >
          <option value="quiz">Quiz</option>
          <option value="correct disposal">Correct Disposal</option>
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Redeemed</FormLabel>
        <Select
          value={data.redeemed}
          onChange={(e) => setData({ ...data, redeemed: e.target.value === 'true' })}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </Select>
      </FormControl>
      <Button colorScheme="green" onClick={handleUpdate}>
        Update Points
      </Button>
    </Box>
  );
};

export default EditPointsPage;
