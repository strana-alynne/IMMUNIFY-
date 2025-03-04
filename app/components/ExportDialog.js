"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportDialog({ vaccines, vaccineName }) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [exportedBy, setExportedBy] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableBatches, setAvailableBatches] = useState([]);

  useEffect(() => {
    // Get unique years from transactions
    const years = [
      ...new Set(vaccines.map((v) => dayjs(v.transaction_date).format("YYYY"))),
    ].sort();

    // Get unique batch numbers
    const batches = [...new Set(vaccines.map((v) => v.batch_number))];

    setAvailableYears(years);
    setAvailableBatches(batches);

    if (years.length > 0) {
      setSelectedYear(years[years.length - 1]); // Default to most recent year
    }
  }, [vaccines]);

  const calculateRunningBalance = (transactions) => {
    let balance = 0;
    return transactions.map((transaction) => {
      if (transaction.transaction_type === "STOCK IN") {
        balance += transaction.transaction_quantity;
      } else {
        balance -= transaction.transaction_quantity;
      }
      return { ...transaction, balance };
    });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExport = () => {
    // Get current date and time for export timestamp
    const exportTimestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // Filter data based on selected year and batch
    const filteredData = vaccines
      .filter((vaccine) => {
        const vaccineDate = dayjs(vaccine.transaction_date);
        const matchesYear = vaccineDate.year().toString() === selectedYear;
        const matchesBatch =
          selectedBatch === "all" || vaccine.batch_number === selectedBatch;
        return matchesYear && matchesBatch;
      })
      .sort((a, b) =>
        dayjs(a.transaction_date).diff(dayjs(b.transaction_date))
      );

    // Calculate running balance for the filtered data
    const dataWithBalance = calculateRunningBalance(filteredData);

    // Create PDF document in landscape orientation
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(16);
    doc.text("STOCK CARD", doc.internal.pageSize.width / 2, 15, {
      align: "center",
    });

    // Add header information
    doc.setFontSize(10);
    doc.text(`Name: ${vaccineName}`, 10, 25);
    doc.text("Stock No:", doc.internal.pageSize.width - 60, 25);
    doc.text("Description: VACCINE", 10, 30);
    doc.text("Re-order Point:", doc.internal.pageSize.width - 60, 30);
    doc.text("Unit of Measurement:", 10, 35);
    doc.text(`Year: ${selectedYear}`, doc.internal.pageSize.width - 60, 40);

    if (selectedBatch !== "all") {
      doc.text(
        `Batch Number: ${selectedBatch}`,
        doc.internal.pageSize.width - 60,
        35
      );
    }

    // Add export information at the bottom of the page
    const pageHeight = doc.internal.pageSize.height;
    doc.text(`Exported By: ${exportedBy || "N/A"}`, 10, pageHeight - 10);
    doc.text(
      `Export Date: ${exportTimestamp}`,
      doc.internal.pageSize.width - 80,
      pageHeight - 10
    );

    // Define table headers
    const headers = [
      [
        "Date",
        "Reference",
        { content: "Receipt", colSpan: 1 },
        { content: "Issue", colSpan: 2 },
        "Balance",
        "Expiration Date",
        "Batch # Lot #",
      ],
      ["", "", "Qty", "Qty", "Office", "Qty", "", ""],
    ];

    // Prepare table data
    const tableData = dataWithBalance.map((vaccine) => {
      const isStockIn = vaccine.transaction_type === "STOCK IN";
      return [
        dayjs(vaccine.transaction_date).format("M-D-YY"),
        "", // Reference column
        isStockIn ? vaccine.transaction_quantity : "", // Receipt Qty
        !isStockIn ? vaccine.transaction_quantity : "", // Issue Qty
        !isStockIn ? "0" : "", // Office
        vaccine.balance, // Running Balance
        dayjs(vaccine.expiration_date).format("M/YYYY"),
        vaccine.batch_number,
      ];
    });

    // Add table
    autoTable(doc, {
      startY: 45,
      head: headers,
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: 0,
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Date
        1: { cellWidth: 30 }, // Reference
        2: { cellWidth: 20, halign: "center" }, // Receipt Qty
        3: { cellWidth: 20, halign: "center" }, // Issue Qty
        4: { cellWidth: 20, halign: "center" }, // Office
        5: { cellWidth: 20, halign: "center" }, // Balance
        6: { cellWidth: 30, halign: "center" }, // Expiration Date
        7: { cellWidth: 40 }, // Batch # Lot #
      },
      margin: { bottom: 15 }, // Add margin at bottom for export info
    });

    // Save PDF with year and batch information in filename
    const batchInfo = selectedBatch !== "all" ? `_Batch${selectedBatch}` : "";
    const fileName = `${vaccineName}_StockCard_${selectedYear}${batchInfo}.pdf`;
    doc.save(fileName);
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
        Export Stock Card
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Export Stock Card</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Batch Number</InputLabel>
              <Select
                value={selectedBatch}
                label="Batch Number"
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <MenuItem value="all">All Batches</MenuItem>
                {availableBatches.map((batch) => (
                  <MenuItem key={batch} value={batch}>
                    {batch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Exported By"
              value={exportedBy}
              onChange={(e) => setExportedBy(e.target.value)}
              placeholder="Enter your name"
              helperText="This will appear in the exported document"
            />

            <Typography variant="caption" color="text.secondary">
              Current date and time will be automatically added to the export
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleExport} variant="contained" color="primary">
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
