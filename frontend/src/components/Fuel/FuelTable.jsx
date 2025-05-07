// src/components/Fuel/FuelTable.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Center,
  useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';
import axios from 'axios';

const FuelTable = () => {
  const [fuelRecords, setFuelRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchVehicleId, setSearchVehicleId] = useState('');

  const toast = useToast();

  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fuel/all');
        const data = response.data;
        // Unique by vehicleId
        const uniqueData = Array.from(new Set(data.map(a => a.vehicleId)))
          .map(id => data.find(d => d.vehicleId === id));
        setFuelRecords(uniqueData);
        setFilteredRecords(uniqueData);
      } catch (error) {
        console.error('Failed to fetch fuel records:', error);
        toast({
          title: 'Fetch Error',
          description: 'Could not load fuel records.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFuelData();
  }, [toast]);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchVehicleId(q);
    if (!q.trim()) {
      setFilteredRecords(fuelRecords);
    } else {
      setFilteredRecords(
        fuelRecords.filter(record =>
          record.vehicleId.includes(q)
        )
      );
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/fuel/delete/${vehicleId}`);
      toast({
        title: 'Fuel Record Deleted',
        description: `Vehicle ${vehicleId} deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFuelRecords(prev => prev.filter(r => r.vehicleId !== vehicleId));
      setFilteredRecords(prev => prev.filter(r => r.vehicleId !== vehicleId));
    } catch (error) {
      console.error(error);
      toast({
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Center><Spinner color="green.500" /></Center>;
  }

  return (
    <Box bg="white" p={6} mt={8} borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="green.600">
          Fuel Records
        </Text>
        <InputGroup width="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            value={searchVehicleId}
            onChange={handleSearchChange}
            placeholder="Search by Vehicle ID"
            size="md"
          />
        </InputGroup>
      </Flex>

      {filteredRecords.length === 0 ? (
        <Text color="red.500" mt={4} textAlign="center">No records found</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead bg="gray.300">
            <Tr>
              <Th>Vehicle ID</Th>
              <Th>Driver ID</Th>
              <Th>Liters</Th>
              <Th>Cost Per Liter</Th>
              <Th>Total Cost</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredRecords.map((record, index) => (
              <Tr key={index}>
                <Td>{record.vehicleId}</Td>
                <Td>{record.driverId}</Td>
                <Td>{record.liters}</Td>
                <Td>Rs.{record.costPerLiter}</Td>
                <Td>Rs.{record.totalCost}</Td>
                <Td>{new Date(record.date).toLocaleDateString()}</Td>
                <Td>
                  {/* 🔑 Corrected route below */}
                  <Button
                    as={Link}
                    to={`/fuel/edit/${record.vehicleId}`}
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(record.vehicleId)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default FuelTable;
