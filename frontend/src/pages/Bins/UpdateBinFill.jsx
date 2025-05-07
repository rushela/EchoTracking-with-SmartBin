// src/pages/Bins/UpdateBinFill.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormLabel, NumberInput, NumberInputField, VStack, useToast, Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBinFill = () => {
  const { binId } = useParams();
  const [fillLevel, setFillLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBin = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bins/list');
        const bin = res.data.find(b => b.binId === binId);
        if (bin) setFillLevel(bin.fillLevel);
        else {
          toast({ title: 'Bin not found', status: 'error' });
          navigate('/bins');
        }
      } catch {
        toast({ title: 'Error loading bin', status: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchBin();
  }, [binId, toast, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/bins/update-fill/${binId}`, { fillLevel });
      toast({ title: 'Fill level updated', status: 'success' });
      navigate('/bins');
    } catch {
      toast({ title: 'Update failed', status: 'error' });
    }
  };

  if (loading) return <Spinner />;

  return (
    <Box p={5}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormLabel>Fill Level (0–100)</FormLabel>
          <NumberInput value={fillLevel} min={0} max={100} onChange={(val) => setFillLevel(Number(val))}>
            <NumberInputField />
          </NumberInput>

          <Button type="submit" colorScheme="blue">Update Fill Level</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default UpdateBinFill;
