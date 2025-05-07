import { useState } from "react";
import { Box, Heading, Input, Button, VStack, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // 👉 import this
import axios from "axios";

export default function AddTruck() {
  const [truckId, setTruckId] = useState("");
  const [capacity, setCapacity] = useState("");
  const toast = useToast();
  const navigate = useNavigate(); // 👉 create navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!truckId || !capacity) {
      toast({
        title: "All fields are required!",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/trucks/add", {
        truckId,
        capacity,
      });

      toast({
        title: "Truck added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // ✅ After success, navigate to Truck List page
      navigate("/trucks");

    } catch (error) {
      toast({
        title: "Error adding truck!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bg="#f5f5f5"
      p={6}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="2xl"
        width={{ base: "90%", md: "500px" }}
        textAlign="center"
      >
        <Heading size="lg" mb={6} color="green.600">
          Add New Truck 🚛
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={5}>
            <Input
              placeholder="Truck ID"
              value={truckId}
              onChange={(e) => setTruckId(e.target.value)}
              focusBorderColor="green.500"
              size="lg"
            />
            <Input
              placeholder="Capacity (kg)"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              focusBorderColor="green.500"
              size="lg"
            />

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="100%"
              borderRadius="full"
              _hover={{ transform: "scale(1.05)" }}
            >
              Add Truck
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}
