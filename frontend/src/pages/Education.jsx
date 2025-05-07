import { useEffect, useState } from 'react';
import { Box, Heading, VStack, Text, Button, Input, Textarea, Center, Spinner, Flex } from '@chakra-ui/react';
import { FaBookOpen, FaCloudDownloadAlt, FaRecycle } from 'react-icons/fa';
import axios from 'axios';
import '../style.css';

export default function Education() {
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(null); // 🎯 Now role loads automatically
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role) {
      setRole(user.role);
    }
    fetchContent();
  }, []);

  const fetchContent = () => {
    axios.get('http://localhost:5000/api/education')
      .then(res => setContent(res.data))
      .catch(err => console.error('Failed to fetch content:', err));
  };

  // Only for testing manually
  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'resident' ? 'environmentalist' : 'resident'));
  };

  const handleFileUpload = async () => {
    if (!file || !title || !description || !category) {
      alert('Please fill all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    setIsUploading(true);

    try {
      await axios.post('http://localhost:5000/api/education/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('File uploaded successfully!');
      setTitle('');
      setDescription('');
      setCategory('');
      setFile(null);
      fetchContent();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload content.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this content?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/education/${id}`);
      alert('Content deleted successfully!');
      setContent(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete content:', error);
      alert('Failed to delete content.');
    }
  };

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      className="education-page-container"
      p={6}
      minHeight="100vh"
        bg="green.600"
      // bgGradient="linear(to-r, #38a169, #2F7D32)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Flex justify="space-between" align="center" width="100%" mb={8}>
        <Heading color="white" textAlign="center" fontSize="3xl">
          Educational Content
        </Heading>

        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width="300px"
          size="lg"
          _focus={{ borderColor: '#2F7D32' }}
          borderRadius="full"
          marginLeft={6}
        />
      </Flex>

      {/* Only show toggle button if localStorage user not found (for testing) */}
      {!localStorage.getItem('user') && (
        <Center mb={6}>
          <Button
            onClick={toggleRole}
            colorScheme="teal"
            size="lg"
            borderRadius="full"
            bg="teal.400"
            _hover={{ bg: 'teal.500' }}
          >
            Toggle Role: {role}
          </Button>
        </Center>
      )}

      {/* No role case */}
      {!role && (
        <Text fontSize="xl" color="white" mt={10}>
          ⚠️ Please log in to view educational content.
        </Text>
      )}

      {/* Motivational Cards */}
      <Box mb={6} textAlign="center">
        <Text fontSize="lg" color="white" mb={4} px={4} lineHeight="1.7">
          <FaBookOpen size={24} color="white" /> <strong>Learn</strong> from comprehensive educational resources.
        </Text>
        <Text fontSize="lg" color="white" mb={4} px={4} lineHeight="1.7">
          <FaCloudDownloadAlt size={24} color="white" /> Access materials easily from anywhere.
        </Text>
        <Text fontSize="lg" color="white" mb={4} px={4} lineHeight="1.7">
          <FaRecycle size={24} color="white" /> <strong>Contribute</strong> by uploading and managing new content.
        </Text>
      </Box>

      {/* Upload Form for Environmentalists */}
      {role === 'environmentalist' && (
        <Box
          bg="#d8dbdc"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          maxWidth="600px"
          margin="auto"
          mb={10}
        >
          <Heading size="lg" mb={4} color="teal.600">
            Upload Educational Content
          </Heading>

          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            mb={4}
            size="lg"
            _focus={{ borderColor: '#2F7D32' }}
          />

          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            mb={4}
            size="lg"
            _focus={{ borderColor: '#2F7D32' }}
          />

          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            mb={4}
            size="lg"
            _focus={{ borderColor: '#2F7D32' }}
          />

          <Input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            mb={4}
            size="lg"
            _focus={{ borderColor: '#2F7D32' }}
          />

          <Button
            colorScheme="teal"
            onClick={handleFileUpload}
            size="lg"
            width="full"
            borderRadius="full"
            isLoading={isUploading}
            _hover={{ bg: '#2F7D32' }}
          >
            {isUploading ? <Spinner size="sm" /> : 'Upload'}
          </Button>
        </Box>
      )}

      {/* Display all contents */}
      <VStack spacing={6} mt={6} width="80%" align="center">
        {filteredContent.map(item => (
          <Box
            key={item._id}
            p={6}
            borderWidth="1px"
            borderRadius="md"
            boxShadow="lg"
            bg="#dce0e0"
            _hover={{ boxShadow: 'xl', transform: 'scale(1.05)', transition: 'all 0.3s ease' }}
            transition="all 0.3s ease"
            width="80%"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color="teal.600" _hover={{ color: 'teal.800' }}>
                {item.title}
              </Heading>
              <Text color="gray.700">{item.description}</Text>
              <Text fontSize="sm" color="gray.500">Category: {item.category}</Text>

              <Button
                colorScheme="teal"
                variant="outline"
                w="full"
                _hover={{ bg: '#2F7D32', color: 'white' }}
                onClick={() => window.open(`http://localhost:5000/api/education/download/${item._id}`, '_blank')}
              >
                Download
              </Button>

              {role === 'environmentalist' && (
                <Button
                  colorScheme="red"
                  variant="outline"
                  w="full"
                  _hover={{ bg: 'red.600', color: 'white' }}
                  mt={4}
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              )}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
