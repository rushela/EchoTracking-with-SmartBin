// import { useState, useEffect } from 'react';
// import { Box, Heading, Input, Textarea, Button, FormControl, FormLabel, Select, Text } from '@chakra-ui/react';
// import axios from 'axios';

// export default function EnvironmentalistPage() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [category, setCategory] = useState('');
//   const [file, setFile] = useState(null);
//   const [content, setContent] = useState([]);
//   const [feedback, setFeedback] = useState('');

//   // Handle uploading content
//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       setFeedback("Please choose a file to upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('title', title);
//     formData.append('description', description);
//     formData.append('category', category);

//     try {
//       const response = await axios.post('http://localhost:5000/api/education/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setFeedback("File uploaded successfully!");
//       setTitle('');
//       setDescription('');
//       setCategory('');
//       setFile(null);
//       fetchContent();  // Refresh content list after upload
//     } catch (error) {
//       console.log('Error uploading file:', error);
//       setFeedback("Failed to upload content.");
//     }
//   };

//   // Handle deleting content
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/education/${id}`);
//       setContent(content.filter(item => item._id !== id));
//       setFeedback('Content deleted successfully!');
//     } catch (error) {
//       console.log('Error deleting content:', error);
//       setFeedback("Failed to delete content.");
//     }
//   };

//   // Fetch all uploaded content
//   const fetchContent = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/education');
//       setContent(response.data);
//     } catch (error) {
//       console.log('Error fetching content:', error);
//     }
//   };

//   // Fetch content on mount
//   useEffect(() => {
//     fetchContent();
//   }, []);

//   return (
//     <Box p={6}>
//       <Heading as="h1" size="xl" mb={6}>Upload Educational Content</Heading>

//       <form onSubmit={handleUpload}>
//         {/* Title input */}
//         <FormControl mb={4}>
//           <FormLabel>Title</FormLabel>
//           <Input 
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Enter the title"
//             required
//           />
//         </FormControl>

//         {/* Description input */}
//         <FormControl mb={4}>
//           <FormLabel>Description</FormLabel>
//           <Textarea 
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter the description"
//             required
//           />
//         </FormControl>

//         {/* Category input */}
//         <FormControl mb={4}>
//           <FormLabel>Category</FormLabel>
//           <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
//             <option value="compost">Compost</option>
//             <option value="recycling">Recycling</option>
//             <option value="education">Education</option>
//           </Select>
//         </FormControl>

//         {/* File input */}
//         <FormControl mb={4}>
//           <FormLabel>Choose File</FormLabel>
//           <Input 
//             type="file" 
//             onChange={(e) => setFile(e.target.files[0])} 
//             required
//           />
//         </FormControl>

//         {/* Submit button */}
//         <Button colorScheme="teal" type="submit">Upload</Button>
//       </form>

//       {/* Feedback Message */}
//       {feedback && <Text mt={4}>{feedback}</Text>}

//       {/* Displaying uploaded content */}
//       <Heading as="h2" size="lg" mt={6}>Uploaded Educational Content</Heading>
//       {content.map(item => (
//         <Box key={item._id} p={4} borderWidth="1px" mt={4}>
//           <Heading size="sm">{item.title}</Heading>
//           <Text>{item.description}</Text>
//           <Button
//             colorScheme="red"
//             onClick={() => handleDelete(item._id)}
//             mt={2}
//           >
//             Delete
//           </Button>
//         </Box>
//       ))}
//     </Box>
//   );
// }
