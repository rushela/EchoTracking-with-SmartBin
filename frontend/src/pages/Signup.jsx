// src/pages/Signup.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.email.trim()) err.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Invalid email';
    if (!form.contact.trim()) err.contact = 'Contact is required';
    else if (!/^[0-9]{10,15}$/.test(form.contact))
      err.contact = 'Must be 10–15 digits';
    if (!form.password) err.password = 'Password is required';
    else if (form.password.length < 6)
      err.password = 'At least 6 characters';
    if (!form.confirmPassword) err.confirmPassword = 'Please confirm';
    else if (form.confirmPassword !== form.password)
      err.confirmPassword = 'Passwords do not match';
    if (!form.role) err.role = 'Role is required';
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
    if (users.find(u => u.email === form.email)) {
      toast({ title: 'Email already registered', status: 'error' });
      return;
    }

    const newUser = {
      name: form.name,
      email: form.email,
      contact: form.contact,
      password: form.password,
      role: form.role
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast({ title: 'Signup successful', status: 'success' });

    // Role‐based redirect
    if (form.role === 'resident')      navigate('/H');
    else if (form.role === 'manager')  navigate('/bins');
    else if (form.role === 'admin')    navigate('/points');
    else                                navigate('/login');
  };

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} boxShadow="lg" borderRadius="md">
      <Heading mb={6} textAlign="center">Sign Up</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input name="name" value={form.name} onChange={handleChange} />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={form.email} onChange={handleChange} />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.contact}>
            <FormLabel>Contact</FormLabel>
            <Input name="contact" value={form.contact} onChange={handleChange} />
            <FormErrorMessage>{errors.contact}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input name="password" type="password" value={form.password} onChange={handleChange} />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.role}>
            <FormLabel>Role</FormLabel>
            <Select name="role" value={form.role} onChange={handleChange} placeholder="Select role">
              <option value="resident">Resident</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>

          <Button type="submit" colorScheme="teal" width="full">Sign Up</Button>

          <Text>
            Already have an account?{' '}
            <ChakraLink as={Link} to="/login" color="teal.500">Login</ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
