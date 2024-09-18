import React, { useState, useEffect } from "react";
import {
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import { parseISO, format } from "date-fns";

// Define the vaccines and their schedule columns
const vaccineCells = [
  { id: "V001", name: "BCG (Bacillus-Calmette-Guerin)", columns: [0] },
  { id: "V002", name: "Hepatitis B", columns: [0] },
  { id: "V003", name: "Penta: DTwP-HepBHib", columns: [1, 2, 3] },
  {
    id: "V005",
    name: "PCV (Pneumococcal Conjugate Vaccine)",
    columns: [1, 2, 3],
  },
  { id: "V004", name: "OPV", columns: [3, 4] },
  { id: "V006", name: "IPV (Inactive Polio Vaccine)", columns: [1, 2, 3] },
  {
    id: "V007",
    name: "MMR (Measles - Mumps - Rubella Vaccine)",
    columns: [4, 5],
  },
];

// Define the table headers (time periods)
const columnHeaders = [
  "24hr",
  "6 weeks",
  "10 weeks",
  "14 weeks",
  "9 months",
  "12 months",
  "15 months",
];

// Helper function to format the date
const formatDate = (date) => {
  if (!date) return "";
  return format(date, "dd/MM/yyyy");
};

// Helper function to get the color based on completion status
const getChipColor = (status) => {
  switch (status) {
    case "Completed":
      return {
        backgroundColor: "primary.dark",
        color: "white",
        fontWeight: "bold",
      };
    case "Partial":
      return {
        backgroundColor: "secondary.light",
        color: "secondary.dark",
        fontWeight: "bold",
      };
    case "Missed":
      return {
        backgroundColor: "error.light",
        color: "error.dark",
        fontWeight: "bold",
      };
    case "Scheduled":
    default:
      return {
        backgroundColor: "default",
        color: "text.secondary",
        fontWeight: "bold",
      };
  }
};

export default function ChildCard({ schedule }) {
  console.log("original schedule", schedule);
  const [vaccineData, setVaccineData] = useState([]);
  useEffect(() => {
    if (schedule && schedule.length) {
      const processedData = vaccineCells.map((vaccine) => {
        // Create an array for doses with null values based on columnHeaders length
        const recordArr = Array(columnHeaders.length).fill(null);

        // Filter out schedules for this specific vaccine
        const vaccineSchedules = schedule.filter(
          (item) => item.vaccine_id === vaccine.id
        );

        // Keep track of the next available column for each vaccine
        let nextAvailableColumn = 0;

        // Iterate over the filtered schedule to fill the corresponding columns
        vaccineSchedules.forEach((item) => {
          const immunizationRecords = item.immunization_records || [];

          console.log(
            "immunization Records",
            immunizationRecords,
            "data",
            item.vaccine_name,
            "length: ",
            immunizationRecords.length
          );

          // Iterate over each immunization record for the vaccine and update the recordArr
          immunizationRecords.forEach((record) => {
            const date = record.date_administered;
            console.log(date);

            // Find the next available column within the vaccine's assigned columns
            while (
              nextAvailableColumn < recordArr.length &&
              (!vaccine.columns.includes(nextAvailableColumn) ||
                recordArr[nextAvailableColumn] !== null)
            ) {
              nextAvailableColumn++;
            }

            // If we have a column available, add the immunization record
            if (nextAvailableColumn < recordArr.length) {
              recordArr[nextAvailableColumn] = {
                date,
                status: record.completion_status || "Scheduled",
              };
              console.log(
                `Updated recordArr[${nextAvailableColumn}]: `,
                recordArr[nextAvailableColumn]
              );
              nextAvailableColumn++; // Move to the next column for the next record
            }
          });
        });

        return {
          ...vaccine,
          recordArr, // Return the vaccine with the corresponding filled recordArr
        };
      });

      // Update state with the processed data
      setVaccineData(processedData);
      console.log("Processed Data:", processedData); // Log the processed data
    }
  }, [schedule]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="vaccine table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Vaccine</TableCell>
            {columnHeaders.map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {vaccineData.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ backgroundColor: "primary.light" }}>
                {row.name}
              </TableCell>
              {row.recordArr.map((dose, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    border: "1px solid #cccccc",
                    backgroundColor: row.columns.includes(index)
                      ? "white" // Set background to white for assigned columns
                      : "#f0f0f0", // Default background for non-assigned columns
                    padding: 1,
                  }}
                >
                  {row.columns.includes(index) && dose ? (
                    <>
                      <Chip
                        label={formatDate(dose.date)}
                        sx={getChipColor(dose.status)}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: getChipColor(dose.status).color }}
                      >
                        {dose.status}
                      </Typography>
                    </>
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
