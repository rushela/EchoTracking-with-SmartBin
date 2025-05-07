// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Invalid email';
    if (!form.password) err.password = 'Password is required';
    return err;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === form.email);
    if (!user) {
      toast({ title: 'No account for this email', status: 'error' });
      return;
    }
    if (user.password !== form.password) {
      toast({ title: 'Incorrect password', status: 'error' });
      return;
    }

    toast({ title: 'Login successful', status: 'success' });

    // Role‐based redirect
    if (user.role === 'resident')      navigate('/H');
    else if (user.role === 'manager')  navigate('/bins');
    else if (user.role === 'admin')    navigate('/points');
    else                                navigate('/login');
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">Login</Button>

          <Text>
            Don’t have an account?{' '}
            <ChakraLink as={Link} to="/signup" color="teal.500">Sign Up</ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
