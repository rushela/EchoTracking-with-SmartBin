// src/components/Payments/PaymentTable.jsx
import React, { useEffect, useState, useCallback } from 'react';
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
  Input,
  InputGroup,
  InputLeftElement,
  Flex
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "lucide-react";
import axios from "axios";

const PaymentTable = ({ refresh }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const fetchPayments = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/all');
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Fetch Failed",
        description: "Could not load payments.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPayments();
  }, [refresh, fetchPayments]);

  const handleDelete = async (driverId) => {
    try {
      await axios.delete(`http://localhost:5000/api/payments/${driverId}`);
      toast({
        title: "Payment Deleted",
        description: `Payment for Driver ${driverId} has been deleted.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchPayments();
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setFilteredPayments(
      payments.filter(p => p.driverId.toString().includes(q))
    );
  };

  if (isLoading) {
    return <Spinner color="green.500" />;
  }

  return (
    <Box bg="white" p={6} mt={8} borderRadius="md" boxShadow="md">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="green.600">
          Driver Payments
        </Text>
        <InputGroup width="300px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by Driver ID"
            size="md"
          />
        </InputGroup>
      </Flex>

      {filteredPayments.length === 0 ? (
        <Text color="red.500" textAlign="center">No records found</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead bg="gray.300">
            <Tr>
              <Th>Driver ID</Th>
              <Th>Working Rides</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPayments.map((payment, idx) => (
              <Tr key={idx}>
                <Td>{payment.driverId}</Td>
                <Td>{payment.workingDays || '-'}</Td>
                <Td>Rs. {payment.amount}</Td>
                <Td>{payment.status}</Td>
                <Td>{new Date(payment.date).toLocaleDateString()}</Td>
                <Td>
                  {/* ← Updated path here: */}
                  <Button
                    as={Link}
                    to={`/payments/edit/${payment.driverId}`}
                    colorScheme="blue"
                    size="sm"
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(payment.driverId)}
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

export default PaymentTable;
