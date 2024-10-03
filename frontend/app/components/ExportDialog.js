"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

export default function ExportDialog({ vaccines, vaccineName }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExport = () => {
    // Filter data based on selected month and year
    const filteredData = vaccines.filter((vaccine) => {
      const vaccineDate = dayjs(vaccine.transaction_date);
      return (
        vaccineDate.month() === selectedDate.month() &&
        vaccineDate.year() === selectedDate.year()
      );
    });

    // Prepare data for export
    const dataToExport = filteredData.map((vaccine) => ({
      "Transaction ID": vaccine.transaction_id,
      Date: vaccine.transaction_date,
      Quantity: vaccine.transaction_quantity,
      "Batch Number": vaccine.batch_number,
      "Expiration Date": vaccine.expiration_date,
      "Transaction Type": vaccine.transaction_type,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vaccine Inventory");

    // Generate filename with vaccine name, month, and year
    const fileName = `${vaccineName}_Inventory_${selectedDate.format("MMMM_YYYY")}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<FileDownload />}
        onClick={handleClickOpen}
        sx={{ ml: 2 }}
      >
        Export Data
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Export Vaccine Inventory</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["month", "year"]}
                label="Select Month and Year"
                minDate={dayjs("2012-03-01")}
                maxDate={dayjs("2024-12-01")}
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleExport} variant="contained" color="primary">
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
