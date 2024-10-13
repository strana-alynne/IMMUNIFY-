"use client";
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
import { format } from "date-fns";
import SchedModal from "@/app/components/Modals/schedModal";
import { updateRecords, deleteRecord } from "@/utils/supabase/api";
import dayjs from "dayjs";

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
  return format(date, "MM/dd/yyyy");
};

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

export default function ChildCard({ schedule, onDataChange, child_id }) {
  const [vaccineData, setVaccineData] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [title, setTitle] = useState("");
  const [age, setAge] = useState("");
  const handleEditCloseModal = () => {
    setOpenEditModal(false);
  };

  useEffect(() => {
    if (schedule && schedule.length) {
      const processedData = vaccineCells.map((vaccine) => {
        const recordArr = Array(columnHeaders.length).fill(null);

        const vaccineSchedules = schedule.filter(
          (item) => item.vaccine_id === vaccine.id
        );

        let nextAvailableColumn = 0;

        vaccineSchedules.forEach((item) => {
          const immunizationRecords =
            item.immunization_records || item.scheduled_date;
          if (immunizationRecords.length === 0) {
            // If there are no immunization records, display the schedule date
            const scheduleDate = item.scheduled_date; // Assuming schedule has a scheduled_date

            while (
              nextAvailableColumn < recordArr.length &&
              (!vaccine.columns.includes(nextAvailableColumn) ||
                recordArr[nextAvailableColumn] !== null)
            ) {
              nextAvailableColumn++;
            }

            if (nextAvailableColumn < recordArr.length) {
              recordArr[nextAvailableColumn] = {
                date: scheduleDate,
                status: "Scheduled", // or another status to show that it's scheduled but not administered yet
              };
              nextAvailableColumn++;
            }
          } else {
            // Process the immunization records as usual
            immunizationRecords.forEach((record) => {
              let date = record.date_administered;
              const recordId = record.record_id;

              while (
                nextAvailableColumn < recordArr.length &&
                (!vaccine.columns.includes(nextAvailableColumn) ||
                  recordArr[nextAvailableColumn] !== null)
              ) {
                nextAvailableColumn++;
              }

              if (nextAvailableColumn < recordArr.length) {
                if (date == null) {
                  date = item.scheduled_date;
                  recordArr[nextAvailableColumn] = {
                    recordId,
                    date,
                    status: record.completion_status || "Scheduled",
                  };
                  nextAvailableColumn++;
                } else {
                  recordArr[nextAvailableColumn] = {
                    recordId,
                    date,
                    status: record.completion_status || "Scheduled",
                  };
                  nextAvailableColumn++;
                }
              }
            });
          }
        });

        return {
          ...vaccine,
          recordArr,
        };
      });

      setVaccineData(processedData);
      // Log the processed data
    }
  }, [schedule]);

  const handleUpdate = async (updateRecord) => {
    await updateRecords(updateRecord);
    onDataChange();
  };
  const handleDelete = async (delRecord) => {
    await deleteRecord(delRecord);
    onDataChange();
  };

  const handleCellClick = (dose, vaccineName, age) => {
    if (dose) {
      setEditingTransaction({
        date_administered: dayjs(dose.date),
        record_id: dose.recordId,
      });
      setTitle(`${vaccineName}`);
      setAge(`${age}`);
      setOpenEditModal(true);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="vaccine table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Vaccine</TableCell>
              {columnHeaders.map((header, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
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
                        ? "white"
                        : "#f0f0f0",
                      padding: 1,
                      cursor:
                        dose && dose.status !== "Scheduled"
                          ? "pointer"
                          : "default", // Only show pointer if clickable
                    }}
                    onClick={() => {
                      // Ensure dose exists and status is not 'Scheduled' before triggering click logic
                      if (dose && dose.status !== "Scheduled") {
                        handleCellClick(dose, row.name, columnHeaders[index]);
                      }
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
      <SchedModal
        open={openEditModal}
        child={child_id}
        onClose={handleEditCloseModal}
        title={title}
        age={age}
        transaction={editingTransaction}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}
