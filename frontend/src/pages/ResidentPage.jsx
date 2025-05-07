// import { useEffect, useState } from 'react';
// import { Box, Heading, Grid, GridItem, Button, Text } from '@chakra-ui/react';
// import axios from 'axios';

// export default function ResidentPage() {
//   const [content, setContent] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredContent, setFilteredContent] = useState([]);

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     const filtered = content.filter(item =>
//       item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
//       item.description.toLowerCase().includes(e.target.value.toLowerCase())
//     );
//     setFilteredContent(filtered);
//   };

//   const handleDownload = (id) => {
//     window.location.href = `http://localhost:5000/api/education/download/${id}`;
//   };

//   // Fetch all content
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/education')
//       .then(res => {
//         setContent(res.data);
//         setFilteredContent(res.data); // Initially show all content
//       })
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <Box p={6}>
//       <Heading as="h1" size="xl" mb={6}>Educational Content</Heading>

//       <Input
//         placeholder="Search content..."
//         value={searchTerm}
//         onChange={handleSearch}
//         mb={6}
//       />

//       <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
//         {filteredContent.map(item => (
//           <GridItem key={item._id}>
//             <Box p={6} borderWidth="1px" borderRadius="md" boxShadow="lg">
//               <Heading size="md">{item.title}</Heading>
//               <Text>{item.description}</Text>
//               <Text fontSize="sm" color="gray.500">Category: {item.category}</Text>
//               <Button
//                 colorScheme="teal"
//                 width="full"
//                 onClick={() => handleDownload(item._id)}
//                 mt={4}
//               >
//                 Download
//               </Button>
//             </Box>
//           </GridItem>
//         ))}
//       </Grid>
//     </Box>
//   );
// }
