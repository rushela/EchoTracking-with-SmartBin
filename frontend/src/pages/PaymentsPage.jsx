// src/pages/PaymentsPage.jsx
import React from 'react';
import { Heading, VStack, Flex, Button } from '@chakra-ui/react';
import PaymentTable from '../components/Payments/PaymentTable';
import MainLayout from '../components/Common/MainLayout';
import { useNavigate } from 'react-router-dom';

const PaymentsPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="green.600">Driver Payments</Heading>
        <Button colorScheme="teal" onClick={() => navigate('/add-payment')}>
           + Add New Driver Payment
        </Button>
      </Flex>

      <VStack spacing={6} align="stretch">
        <PaymentTable />
      </VStack>
    </MainLayout>
  );
};

export default PaymentsPage;
