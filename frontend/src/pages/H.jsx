import { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, VStack, Center, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaUserAlt, FaBookOpen } from 'react-icons/fa';
import logo from '/src/assets/homeig.png';  // Adjust the path if needed

export default function Home() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setRole(user.role);
    }
  }, []);

  return (
    <Box
      p={6}
      bg="green.600"
      // bgGradient="linear(to-r, #38a169, #2F7D32)"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      {/* Header Section */}
      <Heading as="h1" size="4xl" color="white" fontWeight="extrabold" mb={6} letterSpacing="wide">
        Welcome {role === 'resident' ? 'Resident' : role === 'environmentalist' ? 'Environmentalist' : 'Guest'} to EduCommunity!
      </Heading>

      {/* Introduction Text */}
      <Text fontSize={{ base: 'lg', md: 'xl' }} color="white" mb={8} px={4} lineHeight="1.7">
        EduCommunity is your ultimate platform for sustainable living and responsible waste management. 
        We empower individuals and communities by providing resources to help you reduce your environmental 
        footprint and adopt eco-friendly practices such as recycling, composting, and waste reduction. 
        Join us today to be part of the change for a cleaner, greener future.
      </Text>

      {/* Icon Section */}
      <Flex justify="center" mb={10} wrap="wrap">
        <VStack spacing={4} m={4} align="center" w="200px">
          <FaRecycle size="40px" color="white" />
          <Text color="white" fontSize="lg">Recycling Centers</Text>
        </VStack>

        <VStack spacing={4} m={4} align="center" w="200px">
          <FaUserAlt size="40px" color="white" />
          <Text color="white" fontSize="lg">Active Users</Text>
        </VStack>

        <VStack spacing={4} m={4} align="center" w="200px">
          <FaBookOpen size="40px" color="white" />
          <Text color="white" fontSize="lg">Educational Resources</Text>
        </VStack>
      </Flex>

      {/* Navigation Buttons */}
      <VStack spacing={6} align="center" mb={10}>
        <Button
          as={Link}
          to="/education"
          colorScheme="teal"
          size="lg"
          width={{ base: '100%', md: '250px' }}
          borderRadius="full"
          padding="20px"
          _hover={{ bg: 'teal.600', transform: 'scale(1.05)' }}
          transition="all 0.3s ease-in-out"
          boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
        >
          Go to Education
        </Button>

        <Button
          as={Link}
          to="/forum"
          colorScheme="blue"
          size="lg"
          width={{ base: '100%', md: '250px' }}
          borderRadius="full"
          padding="20px"
          _hover={{ bg: 'blue.600', transform: 'scale(1.05)' }}
          transition="all 0.3s ease-in-out"
          boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
        >
          Go to Forum
        </Button>

        {role === 'resident' && (
          <Button
            as={Link}
            to="/quiz"
            colorScheme="purple"
            size="lg"
            width={{ base: '100%', md: '250px' }}
            borderRadius="full"
            padding="20px"
            _hover={{ bg: 'purple.600', transform: 'scale(1.05)' }}
            transition="all 0.3s ease-in-out"
            boxShadow="0px 4px 15px rgba(0, 0, 0, 0.2)"
          >
            Go to Quizzes
          </Button>
        )}
      </VStack>

      {/* Image Section */}
      <Center mb={10}>
        <Image
          src={logo}
          alt="Green Earth"
          width="100%"
          maxW="1200px"
          height="auto"
          objectFit="cover"
          borderRadius="md"
        />
      </Center>

      {/* Additional Resources Section */}
      <Center mt={12}>
        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          width={{ base: '100%', md: '80%' }}
          maxWidth="800px"
        >
          <Heading size="lg" color="teal.600" mb={4}>
            Explore Our Resources
          </Heading>
          <Text fontSize="lg" color="gray.700" lineHeight="1.6">
            Dive into comprehensive guides and tutorials on sustainable waste management, eco-friendly practices,
            and community engagement. Get started with small steps toward a sustainable future.
          </Text>
        </Box>
      </Center>
    </Box>
  );
}
