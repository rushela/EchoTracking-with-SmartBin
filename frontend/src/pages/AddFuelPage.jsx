import React from 'react';
import { Heading, VStack } from '@chakra-ui/react';
import AddFuelForm from '../components/Fuel/AddFuelForm';
import MainLayout from '../components/Common/MainLayout';

const AddFuelPage = () => {
  return (
    <MainLayout>
      <Heading mb={6} color="green.600">Add New Fuel Record</Heading>
      <VStack spacing={6} align="stretch">
        <AddFuelForm />
      </VStack>
    </MainLayout>
  );
};

export default AddFuelPage;
