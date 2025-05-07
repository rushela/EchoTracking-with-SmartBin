import React, { useEffect, useState } from 'react';
import {
  Box, Button, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, useToast, Flex, Text,
  Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import axios from 'axios';

const BinList = () => {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullBins, setFullBins] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const toast = useToast();

  const fetchBins = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bins/list');
      setBins(res.data);
      
      // Check for full bins
      const fullBins = res.data.filter(bin => bin.fillLevel >= 90);
      if (fullBins.length > 0) {
        setFullBins(fullBins);
        setShowAlert(true);
      }
    } catch {
      toast({ title: 'Failed to load bins', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const deleteBin = async (id) => {
    if (!window.confirm('Delete this bin?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/bins/delete/${id}`);
      toast({ title: 'Deleted', status: 'success' });
      fetchBins();
    } catch {
      toast({ title: 'Delete failed', status: 'error' });
    }
  };

  useEffect(() => {
    fetchBins(); // initial fetch
    const interval = setInterval(fetchBins, 5000); // refresh every 5s
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <Box p={6} bg="#f5f5f5" minHeight="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", sm: "80%", md: "100%" }}
        mx="auto"
      >
        {/* Title & Add Button */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="teal.600">
            Bin Management 🗑️
          </Heading>
          <Button as={Link} to="/bins/add" colorScheme="teal" borderRadius="full" _hover={{ transform: 'scale(1.05)' }}>
            + Add Bin
          </Button>
        </Flex>

        {/* Full Bin Alert */}
        {showAlert && fullBins.length > 0 && (
          <Alert status="error" mb={4} borderRadius="lg">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Full Bins Alert!</AlertTitle>
              <AlertDescription>
                The following bins are nearly full ({fullBins.length}): {fullBins.map(bin => bin.binId).join(', ')}
              </AlertDescription>
            </Box>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowAlert(false)} />
          </Alert>
        )}

        {/* Spinner or Table */}
        {loading ? (
          <Spinner size="xl" color="teal.500" />
        ) : bins.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No bins available.
          </Text>
        ) : (
          <Table variant="striped" colorScheme="gray" size="lg" borderWidth="1px" borderColor="gray.200">
            <Thead bg="teal.500">
              <Tr>
                <Th color="white" borderRight="1px" borderColor="gray.300">Bin ID</Th>
                <Th color="white" borderRight="1px" borderColor="gray.300">Location</Th>
                <Th color="white" borderRight="1px" borderColor="gray.300">Type</Th>
                <Th color="white" borderRight="1px" borderColor="gray.300">Fill Level</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bins.map(bin => (
                <Tr key={bin.binId} _hover={{ bg: '#f0fdf4' }}>
                  <Td borderRight="1px" borderColor="gray.200">{bin.binId}</Td>
                  <Td borderRight="1px" borderColor="gray.200">{bin.location}</Td>
                  <Td borderRight="1px" borderColor="gray.200">{bin.type}</Td>
                  <Td borderRight="1px" borderColor="gray.200" color={bin.fillLevel >= 90 ? 'red.500' : 'black'}>
                    {bin.fillLevel}%
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button as={Link} to={`/bins/update/${bin.binId}`} size="sm" colorScheme="blue" borderRadius="full">
                        Update
                      </Button>
                      <Button colorScheme="red" size="sm" onClick={() => deleteBin(bin.binId)} borderRadius="full">
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default BinList;
