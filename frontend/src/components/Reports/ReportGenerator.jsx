// src/components/Reports/ReportGenerator.jsx
import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  Heading
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ReportGenerator({
  fuelData,
  paymentData,
  pointsData,
  searchId
}) {
  const filterData = (data) => {
    if (!searchId.trim()) return data;
    return data.filter((item) =>
      (item.vehicleId && item.vehicleId.includes(searchId)) ||
      (item.userId    && item.userId.includes(searchId)) ||
      (item.driverId  && item.driverId.includes(searchId))
    );
  };

  // Destructure out internal fields and alias to underscore-prefixed vars
  const cleanRow = (row) => {
    const {
      _id,
      __v,
      currentPoints: _currentPoints,
      redeemedPoints: _redeemedPoints,
      ...rest
    } = row;
    return rest;
  };

  const handleExportPDF = (rowData, title) => {
    const doc = new jsPDF();
    const now = new Date().toLocaleString();

    doc.setFillColor(255, 255, 255);
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    doc.setFontSize(18);
    doc.text(
      "Financial Report",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.text(
      "Generated by Recycling Locator Platform",
      doc.internal.pageSize.getWidth() / 2,
      28,
      { align: "center" }
    );
    doc.text(
      `Date: ${now}`,
      doc.internal.pageSize.getWidth() / 2,
      36,
      { align: "center" }
    );

    const cleaned = cleanRow(rowData);

    autoTable(doc, {
      startY: 50,
      head: [Object.keys(cleaned)],
      body: [Object.values(cleaned)],
      styles: {
        halign: "center",
        valign: "middle",
        lineColor: [44, 62, 80],
        lineWidth: 0.5,
        fillColor: [244, 247, 255]
      },
      headStyles: {
        fillColor: [0, 128, 128],
        textColor: [255, 255, 255],
        fontSize: 12
      }
    });

    doc.save(`${title}-report.pdf`);
  };

  const handleExportExcel = (rowData, title) => {
    const wb = XLSX.utils.book_new();
    const cleaned = cleanRow(rowData);
    const ws = XLSX.utils.json_to_sheet([cleaned]);
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${title}-report.xlsx`);
  };

  const renderTable = (data, title) => (
    <Box mb={8} width="100%">
      <Heading fontSize="xl" mb={4}>{title}</Heading>
      <Table variant="simple">
        <Thead bg="gray.300">
          <Tr>
            {data[0] && Object.keys(cleanRow(data[0])).map((key) => (
              <Th key={key}>{key}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filterData(data).map((row, idx) => (
            <Tr key={idx} _hover={{ bg: 'gray.100' }}>
              {Object.values(cleanRow(row)).map((val, i) => (
                <Td key={i}>{val?.toString()}</Td>
              ))}
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleExportPDF(row, title)}
                >
                  PDF
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => handleExportExcel(row, title)}
                >
                  Excel
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );

  return (
    <VStack spacing={10} align="stretch">
      {renderTable(fuelData,    "Fuel Data")}
      {renderTable(paymentData, "Payment Data")}
      {renderTable(pointsData,  "Points Data")}
    </VStack>
  );
}
