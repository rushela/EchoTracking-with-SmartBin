import React from 'react';
import { Heading, VStack, Flex, Button } from '@chakra-ui/react';
import PointsTable from '../components/Points/PointsTable';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Common/MainLayout';

const PointsPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="green.600">Points Redemption</Heading>
        <Button colorScheme="teal" onClick={() => navigate('/add-points')}>
          + Add Points
        </Button>
      </Flex>
      <VStack spacing={6} align="stretch">
        <PointsTable />
      </VStack>
    </MainLayout>
  );
};

export default PointsPage;
