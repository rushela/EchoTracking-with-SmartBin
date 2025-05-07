import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const Loader = ({ message = "Loading..." }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="200px"
      gap={4}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.500"
        size="xl"
      />
      <Text fontSize="md" color="gray.600">{message}</Text>
    </Flex>
  );
};

export default Loader;
