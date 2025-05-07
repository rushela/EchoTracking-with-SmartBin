import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Button,
  Heading,
  Text,
  Center,
  Flex
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

const RecyclingCenterList = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchCenters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/recycling-centers/list");
      setCenters(res.data);
    } catch (err) {
      toast({
        title: "Failed to load centers",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCenter = async (id) => {
    if (!window.confirm("Are you sure you want to delete this center?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/recycling-centers/delete/${id}`);
      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchCenters(); // refresh list
    } catch (err) {
      toast({
        title: "Delete failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <Box p={6} bg="#f5f5f5" minHeight="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "95%", md: "80%" }}
        mx="auto"
      >
        {/* Title & Add Button */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="green.600">
            Recycling Center Management ♻️
          </Heading>
          <Button
            as={Link}
            to="/add-center"
            colorScheme="teal"
            borderRadius="full"
            _hover={{ transform: "scale(1.05)" }}
          >
            + Add Recycling Center
          </Button>
        </Flex>

        {/* Spinner or Table */}
        {loading ? (
          <Center>
            <Spinner size="xl" color="green.500" />
          </Center>
        ) : centers.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            No centers available.
          </Text>
        ) : (
          <Table variant="striped" colorScheme="gray">
            <Thead bg="green.600">
              <Tr>
                <Th color="white">Center ID</Th>
                <Th color="white">Name</Th>
                <Th color="white">Location</Th>
                <Th color="white">Materials Accepted</Th>
                <Th color="white">Contact</Th>
                <Th color="white">Operational Hours</Th>
                <Th color="white">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {centers.map((center) => (
                <Tr key={center.centerId} _hover={{ bg: "#f0fdf4" }}>
                  <Td>{center.centerId}</Td>
                  <Td>{center.name}</Td>
                  <Td>{center.location}</Td>
                  <Td>{center.materialsAccepted.join(", ")}</Td>
                  <Td>{center.contactNumber}</Td>
                  <Td>{center.operationalHours}</Td>
                  <Td>
                    <Flex justify="start" gap={2}>
                      <Button
                        as={Link}
                        to={`/edit-center/${center.centerId}`}
                        colorScheme="blue"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => deleteCenter(center.centerId)}
                      >
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

export default RecyclingCenterList;
