import React from 'react';
import { Heading, Flex, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import FuelTable from '../components/Fuel/FuelTable';
import MainLayout from '../components/Common/MainLayout';

const FuelPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="green.600">Fuel Cost Management</Heading>
        <Button colorScheme="teal" onClick={() => navigate('/add-fuel')}>
          + Add New Fuel Record
        </Button>
      </Flex>

      <VStack spacing={6} align="stretch">
        <FuelTable />
      </VStack>
    </MainLayout>
  );
};

export default FuelPage;
