// src/components/Points/PointsTable.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Flex,
  Heading
} from '@chakra-ui/react';
import { SearchIcon } from 'lucide-react';
import axios from 'axios';

const PointsTable = () => {
  const [points, setPoints] = useState([]);
  const [filteredPoints, setFilteredPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch all points
  const fetchPoints = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/points/all');
      setPoints(res.data);
      setFilteredPoints(res.data);
    } catch (err) {
      console.error('Error fetching points:', err);
      toast({
        title: 'Error',
        description: 'Could not load points.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  // Delete a record
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/points/delete/${userId}`);
      toast({
        title: 'Deleted',
        description: 'Record deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPoints();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Delete Failed',
        description: err.response?.data?.message || 'Error deleting record.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Redeem points
  const handleRedeem = async (record) => {
    try {
      await axios.put(
        `http://localhost:5000/api/points/redeem/${record.userId}`,
        { earnedPoints: record.earnedPoints },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast({
        title: 'Redeemed!',
        description: 'Points successfully redeemed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPoints();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Redeem Failed',
        description: err.response?.data?.message || 'Error redeeming points.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Filter on search
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setFilteredPoints(points);
    } else {
      const lower = q.toLowerCase();
      setFilteredPoints(
        points.filter(
          (p) =>
            p.userId.toLowerCase().includes(lower) ||
            p.source.toLowerCase().includes(lower)
        )
      );
    }
  };

  // Open edit modal
  const openEditModal = (record) => {
    setSelectedPoint(record);
    onOpen();
  };

  // Submit edit
  const handleEditSubmit = async () => {
    try {
      const { userId, earnedPoints, source, redeemed, date } = selectedPoint;
      await axios.put(
        `http://localhost:5000/api/points/update/${userId}`,
        { earnedPoints, source, redeemed, date },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast({
        title: 'Updated!',
        description: 'Record updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchPoints();
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: 'Update Failed',
        description: err.response?.data?.message || 'Error updating record.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p={6} mt={8} borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="green.600">User Points</Heading>
        <InputGroup width="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by User ID or Source"
          />
        </InputGroup>
      </Flex>

      {isLoading ? (
        <Spinner color="green.500" />
      ) : filteredPoints.length === 0 ? (
        <Text color="red.500" textAlign="center">No records found.</Text>
      ) : (
        <Table variant="striped" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th>User ID</Th>
              <Th>Earned</Th>
              <Th>Redeemed</Th>
              <Th>Redeem?</Th>
              <Th>Date</Th>
              <Th>Source</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPoints.map((rec, i) => (
              <Tr key={i}>
                <Td>{rec.userId}</Td>
                <Td>{rec.earnedPoints}</Td>
                <Td>{rec.redeemedPoints}</Td>
                <Td>
                  {rec.redeemed ? (
                    'Yes'
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleRedeem(rec)}
                      _hover={{ bg: 'green.500' }}
                    >
                      Redeem
                    </Button>
                  )}
                </Td>
                <Td>{new Date(rec.date).toLocaleDateString()}</Td>
                <Td textTransform="capitalize">{rec.source}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => openEditModal(rec)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDelete(rec.userId)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* Edit Modal */}
      {selectedPoint && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit: {selectedPoint.userId}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Earned Points</FormLabel>
                <Input
                  type="number"
                  value={selectedPoint.earnedPoints}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      earnedPoints: Number(e.target.value)
                    })
                  }
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Source</FormLabel>
                <Select
                  value={selectedPoint.source}
                  onChange={(e) =>
                    setSelectedPoint({ ...selectedPoint, source: e.target.value })
                  }
                >
                  <option value="quiz">Quiz</option>
                  <option value="correct disposal">Correct Disposal</option>
                </Select>
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={new Date(selectedPoint.date)
                    .toISOString()
                    .substr(0, 10)}
                  onChange={(e) =>
                    setSelectedPoint({ ...selectedPoint, date: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={3}>
                <FormLabel>Redeemed</FormLabel>
                <Select
                  value={selectedPoint.redeemed ? 'true' : 'false'}
                  onChange={(e) =>
                    setSelectedPoint({
                      ...selectedPoint,
                      redeemed: e.target.value === 'true'
                    })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" onClick={handleEditSubmit}>
                Save
              </Button>
              <Button ml={3} onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default PointsTable;
