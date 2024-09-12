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

const vaccineSchedule = [
  { id: "V001", name: "BCG (Bacillus-Calmette-Guerin)", columns: [0] },
  { id: "V002", name: "Hepatitis B", columns: [0] },
  { id: "V003", name: "Penta: DTwP-HepBHib", columns: [1, 2, 3] },
  {
    id: "V004",
    name: "PCV (Pnuemococcal Conjugate Vaccine)",
    columns: [1, 2, 3],
  },
  { id: "V005", name: "OPV", columns: [3, 4] },
  { id: "V006", name: "IPV (Inactive Polio Vaccine)", columns: [1, 2, 3] },
  {
    id: "V007",
    name: "MMR (Measles - Mumps - Rubella Vaccine)",
    columns: [4, 5],
  },
];

const columnHeaders = [
  "24hr",
  "6 weeks",
  "10 weeks",
  "14 weeks",
  "9 months",
  "12 months",
  "15 months",
];

export default function ChildCard({ schedule }) {
  const [vaccineData, setVaccineData] = useState([]);

  useEffect(() => {
    const processScheduleData = () => {
      const scheduleMap = new Map(
        schedule.map((item) => [item.vaccine_id, item])
      );
      const updatedVaccineData = vaccineSchedule.map((vaccine) => {
        const doses = Array(columnHeaders.length).fill(null);
        const scheduleItem = scheduleMap.get(vaccine.id);

        if (scheduleItem) {
          vaccine.columns.forEach((columnIndex) => {
            if (
              scheduleItem.immunization_records &&
              scheduleItem.immunization_records.length > 0
            ) {
              doses[columnIndex] = scheduleItem.immunization_records.map(
                (record) => {
                  return {
                    date: record.date_administered
                      ? parseISO(record.date_administered)
                      : scheduleItem.scheduled_date,
                    status: record.completion_status,
                  };
                }
              );
            } else if (scheduleItem.scheduled_date) {
              doses[columnIndex] = [
                {
                  date: parseISO(scheduleItem.scheduled_date),
                  status: scheduleItem.immunization_records?.completion_status,
                },
              ];
            }
          });
        }
        return { ...vaccine, doses };
      });
      setVaccineData(updatedVaccineData);
    };

    processScheduleData();
  }, [schedule]);

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  const getChipColor = (status) => {
    switch (status) {
      case "Completed":
        return {
          backgroundColor: "primary.dark",
          color: "white",
          fontWeight: "bold",
        }; // You can use hex codes or predefined MUI colors here
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
      default:
        return "default"; // fallback color
    }
  };
  const getHelperText = (status) => {
    switch (status) {
      case "Completed":
        return {
          color: "primary.dark",
        }; // You can use hex codes or predefined MUI colors here
      case "Partial":
        return {
          color: "secondary.dark",
        };
      case "Missed":
        return {
          color: "error.dark",
        };
      default:
        return "default"; // fallback color
    }
  };

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
              {row.doses.map((dose, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    border: "1px solid #cccccc",
                    backgroundColor: row.columns.includes(index)
                      ? "inherit"
                      : "#f0f0f0",
                    padding: 1,
                  }}
                >
                  {row.columns.includes(index) && dose ? (
                    <>
                      {dose.map((record, recordIndex) => (
                        <div>
                          <Chip
                            key={recordIndex}
                            label={formatDate(record.date)}
                            sx={getChipColor(record.status)}
                          />
                          <Typography
                            variant="caption"
                            sx={getHelperText(record.status)}
                          >
                            {record.status}
                          </Typography>
                        </div>
                      ))}
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
