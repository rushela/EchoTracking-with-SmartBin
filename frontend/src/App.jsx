// src/App.jsx
import React from 'react';
import {
  ChakraProvider,
  Box,
  Button
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  Outlet
} from 'react-router-dom';

import theme from './theme';

import Signup from './pages/Signup';
import Login from './pages/Login';

import Home from './pages/H';
import Education from './pages/Education';
import Forum from './pages/Forum';
import Quizzes from './pages/Quizzes';

import RecyclingCenterList from './pages/RecyclingCenters/RecyclingCenterList';
import AddRecyclingCenter from './pages/RecyclingCenters/AddRecyclingCenter';
import EditRecyclingCenter from './pages/RecyclingCenters/EditRecyclingCenter';

import DriverList from './pages/Drivers/DriverList';
import AddDriver from './pages/Drivers/AddDriver';
import EditDriver from './pages/Drivers/EditDriver';

import TruckList from './pages/Trucks/TruckList';
import AddTruck from './pages/Trucks/AddTruck';
import UpdateTruckStatus from './pages/Trucks/UpdateTruckStatus';

import BinList from './pages/Bins/BinList';
import AddBin from './pages/Bins/AddBin';
import UpdateBinFill from './pages/Bins/UpdateBinFill';

import PointsPage from './pages/PointsPage';
import AddPointsPage from './pages/AddPointsPage';
import FuelPage from './pages/FuelPage';
import AddFuelPage from './pages/AddFuelPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentForm from './components/Payments/PaymentForm';
import ReportsPage from './pages/ReportsPage';
import EditPointsPage from './pages/EditPointsPage';
import EditFuelPage from './pages/EditFuelPage';
import EditPaymentPage from './pages/EditPaymentPage';

import Sidebar from './pages/Sidebar';

import './style.css';
import './App.css';

// Manager/Admin (Recycling) layout
function SidebarLayout() {
  return (
    // full viewport height
    <Box display="flex" h="100vh">
      <Sidebar />
      <Box
        // responsive left margin
        ml={{ base: 0, md: '250px' }}
        p={4}
        flex="1"
        overflow="auto"
        bg="gray.50"
      >
        <Outlet />
      </Box>
    </Box>
  );
}

// Resident layout (top nav)
function ResidentLayout() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* top navbar */}
      <Box p={4} bg="white" boxShadow="sm">
        <NavLink to="/H"><Button mr={2}>Home</Button></NavLink>
        <NavLink to="/education"><Button mr={2}>Education</Button></NavLink>
        <NavLink to="/forum"><Button mr={2}>Forum</Button></NavLink>
        {user.role === 'resident' && <NavLink to="/quiz"><Button>Quiz</Button></NavLink>}
      </Box>
      {/* content fills rest */}
      <Box flex="1" p={4} overflow="auto" bg="gray.50">
        <Outlet />
      </Box>
    </Box>
  );
}

// Admin layout (financial routes)
function AdminLayout() {
  return (
    <Box h="100vh" display="flex" flexDirection="column">
      {/* content panel */}
      <Box flex="1" p={4} overflow="auto" bg="gray.50">
        <Outlet />
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Resident */}
          <Route element={<ResidentLayout />}>
            <Route path="/H"         element={<Home />} />
            <Route path="/education" element={<Education />} />
            <Route path="/forum"     element={<Forum />} />
            <Route path="/quiz"      element={<Quizzes />} />
          </Route>

          {/* Manager (Recycling) */}
          <Route element={<SidebarLayout />}>
            <Route path="/centers"         element={<RecyclingCenterList />} />
            <Route path="/add-center"      element={<AddRecyclingCenter />} />
            <Route path="/edit-center/:id" element={<EditRecyclingCenter />} />

            <Route path="/drivers"         element={<DriverList />} />
            <Route path="/drivers/add"     element={<AddDriver />} />
            <Route path="/drivers/edit/:id"element={<EditDriver />} />

            <Route path="/trucks"            element={<TruckList />} />
            <Route path="/trucks/add"        element={<AddTruck />} />
            {/* ⚠️ important: use :truckId here */}
            <Route path="/trucks/update/:truckId" element={<UpdateTruckStatus />} />

            <Route path="/bins"            element={<BinList />} />
            <Route path="/bins/add"        element={<AddBin />} />
            <Route path="/bins/update/:id" element={<UpdateBinFill />} />
          </Route>

          {/* Admin (Financial) */}
          <Route element={<AdminLayout />}>
            <Route path="/points"              element={<PointsPage />} />
            <Route path="/add-points"          element={<AddPointsPage />} />
            <Route path="/points/edit/:userId" element={<EditPointsPage />} />

            <Route path="/fuel"                element={<FuelPage />} />
            <Route path="/add-fuel"            element={<AddFuelPage />} />
            <Route path="/fuel/edit/:vehicleId"element={<EditFuelPage />} />

            <Route path="/payments"            element={<PaymentsPage />} />
            <Route path="/add-payment"         element={<PaymentForm />} />
            <Route path="/payments/edit/:id"   element={<EditPaymentPage />} />

            <Route path="/reports"             element={<ReportsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
