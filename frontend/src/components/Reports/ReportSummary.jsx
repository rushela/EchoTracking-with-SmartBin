// frontend/src/components/Reports/ReportSummary.jsx
import { Box, Text, Stat, StatLabel, StatNumber } from '@chakra-ui/react';

export default function ReportSummary({ totalExpense }) {
  return (
    <Box p={6} border="2px solid #ccc" borderRadius="md" mb={8}>
      <Stat>
        <StatLabel fontSize="lg">Total Expenses</StatLabel>
        <StatNumber fontSize="3xl" color="teal.500">
          Rs.{totalExpense?.toFixed(2)}
        </StatNumber>
      </Stat>
    </Box>
  );
}
