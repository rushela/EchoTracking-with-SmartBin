// frontend/src/pages/ReportsPage.jsx
import { Box, Heading, VStack, Input, Button, Flex, Divider } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import ReportSummary from '../components/Reports/ReportSummary';
import ReportGenerator from '../components/Reports/ReportGenerator';
import axios from 'axios';
import MainLayout from '../components/Common/MainLayout';

export default function ReportsPage() {
  const [reportData, setReportData] = useState({});
  const [searchId, setSearchId] = useState("");

  const fetchReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/generate"); // <--- FULL URL NOW
      setReportData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSearchChange = (e) => setSearchId(e.target.value);

  return (
    <MainLayout> {/* Wrap everything inside MainLayout now */}
      <Heading mb={4} color="green.600">Financial Reports</Heading>

      <VStack spacing={6} align="stretch">
        <Flex mb={4} gap={4}>
          <Input 
            placeholder="Search by Vehicle/User/Driver ID"
            value={searchId}
            onChange={handleSearchChange}
          />
        </Flex>

        <ReportSummary totalExpense={reportData.totalExpense} />
        <Divider mb={4} />
        <ReportGenerator 
          fuelData={reportData.fuelData || []} 
          paymentData={reportData.paymentData || []} 
          pointsData={reportData.pointsData || []}
          searchId={searchId}
        />
      </VStack>
    </MainLayout>
  );
}
