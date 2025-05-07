import { useEffect, useState } from 'react';
import {
  Box, Heading, VStack, Text, Button,
  Grid, GridItem, Input, Textarea, Center
} from '@chakra-ui/react';
import axios from 'axios';
import '../style.css';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState({});
  const [role, setRole] = useState(null); // will be loaded from localStorage

  // Detect role on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setRole(user.role); // Set based on login
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Only for testing if needed
  const toggleRole = () => {
    setRole(role === 'resident' ? 'environmentalist' : 'resident');
  };

  const handlePostQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/forum', { question, role });
      setQuestion('');
      fetchPosts();
    } catch (error) {
      console.error('Error posting question:', error);
      alert("Failed to post question.");
    }
  };

  const handleAnswer = async (postId) => {
    const answer = responses[postId];
    if (!answer || !answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/forum/${postId}/answer`, {
        response: answer,
        role,
      });

      setResponses({ ...responses, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error answering question:', error);
      alert("Failed to post answer.");
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/forum/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error('Error deleting post:', error);
      alert("Failed to delete post.");
    }
  };

  return (
    <Box
      className="forum-page-container"
      p={6}
      minHeight="100vh"
        bg="green.600"
      // bgGradient="linear(to-r, #38a169, #2F7D32)"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Center mb={8}>
        <Heading as="h1" size="2xl" color="white" fontWeight="bold">
          Forum
        </Heading>
      </Center>

      {/* Toggle Button (for testing, hide when real user exists) */}
      {!localStorage.getItem("user") && (
        <Center mb={6}>
          <Button
            bg="green.400"
            color="white"
            size="lg"
            borderRadius="full"
            _hover={{ bg: 'green.600' }}
            onClick={toggleRole}
          >
            Toggle Role: {role}
          </Button>
        </Center>
      )}

      {/* No role available */}
      {!role && (
        <Text fontSize="xl" color="white" mt={10}>
          ⚠️ Please log in to participate in the forum.
        </Text>
      )}

      {/* Question Form */}
      {role === 'resident' && (
        <Box
          mb={8}
          bg="#e8f5e9"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          maxWidth="600px"
          margin="auto"
        >
          <Heading size="lg" mb={4} color="green.700">
            Ask a Question
          </Heading>
          <Input
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            mb={4}
            size="lg"
            _focus={{ borderColor: 'green.500' }}
          />
          <Button
            bg="green.600"
            color="white"
            size="lg"
            width="full"
            _hover={{ bg: 'green.700' }}
            onClick={handlePostQuestion}
          >
            Post Question
          </Button>
        </Box>
      )}

      {/* Forum Posts */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} mt={6}>
        {posts.map(post => (
          <GridItem key={post._id}>
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="md"
              bg="white"
              boxShadow="lg"
              _hover={{
                boxShadow: 'xl',
                transform: 'scale(1.05)',
                transition: 'all 0.3s ease',
              }}
              transition="all 0.3s ease"
            >
              <VStack align="stretch" spacing={4}>
                <Heading size="md" color="green.600" _hover={{ color: 'green.800' }}>
                  {post.question}
                </Heading>
                <Text color="gray.700">
                  {post.response || "Awaiting response..."}
                </Text>

                {/* Environmentalist - Answer */}
                {role === 'environmentalist' && (
                  <Box>
                    <Textarea
                      placeholder="Your answer..."
                      value={responses[post._id] || ''}
                      onChange={(e) =>
                        setResponses({ ...responses, [post._id]: e.target.value })
                      }
                      mb={4}
                      size="lg"
                      _focus={{ borderColor: 'green.500' }}
                    />
                    <Button
                      bg="green.500"
                      color="white"
                      size="lg"
                      width="full"
                      _hover={{ bg: 'green.600' }}
                      onClick={() => handleAnswer(post._id)}
                    >
                      Answer
                    </Button>
                  </Box>
                )}

                {/* Resident - Delete */}
                {role === 'resident' && (
                  <Button
                    color="red.600"
                    border="1px solid"
                    borderColor="red.400"
                    w="full"
                    _hover={{ bg: 'red.500', color: 'white' }}
                    mt={4}
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete Question
                  </Button>
                )}
              </VStack>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
