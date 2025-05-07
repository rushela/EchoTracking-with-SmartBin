import React from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import RedeemPointsForm from '../components/Points/RedeemPointsForm';
import MainLayout from '../components/Common/MainLayout';

const AddPointsPage = () => {
  return (
    <MainLayout>
      <Heading mb={6} color="green.600">Add New Points</Heading>
      <VStack spacing={6} align="stretch">
        <RedeemPointsForm />
      </VStack>
    </MainLayout>
  );
};

export default AddPointsPage;
