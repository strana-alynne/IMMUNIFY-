"use client";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Typography,
  Stack,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { fetchVaccineStock, addVaccineStock } from "@/utils/supabase/api";
import { useState, useEffect } from "react";

const Details = ({ params }) => {
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [expirationDate, setexpirationDate] = useState(dayjs());
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [inventoryID, setInventoryID] = useState(params.id);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  //TABLE THINGSSS
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // LOADS THE DATA
  useEffect(() => {
    async function loadVaccines() {
      const storedVaccineName = localStorage.getItem("selectedVaccineName");
      const storeInventoryId = localStorage.getItem("inventoryID");
      const fetchedVaccines = await fetchVaccineStock(storeInventoryId);
      console.log("Vaccines loaded in component:", fetchedVaccines);
      setVaccineName(storedVaccineName);
      setInventoryID(storeInventoryId);
      setVaccines(fetchedVaccines);
    }
    loadVaccines();
  }, [params.id]);

  const handleButtonClick = async () => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const exformattedDate = expirationDate.format("YYYY-MM-DD");
    const vaccineStockDetails = {
      transaction_date: formattedDate,
      transaction_type: transactionType,
      transaction_quantity: parseInt(quantity, 10),
      batch_number: batchNumber,
      expiration_date: exformattedDate,
      inventory_id: inventoryID,
    };
    console.log("Vaccine stock details:", vaccineStockDetails);
    const result = await addVaccineStock(vaccineStockDetails);

    if (result) {
      console.log("Vaccine stock added successfully:", result);
      const updatedVaccines = await fetchVaccineStock(inventoryID);
      setVaccines(updatedVaccines);
    } else {
      console.error("Failed to add vaccine stock.");
    }
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleExpirationDateChange = (newDate) => {
    setexpirationDate(newDate);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleBatchNumberChange = (event) => {
    setBatchNumber(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction={"column"}>
            <Stack direction="row" spacing={0.5}>
              <VaccinesIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h2" color="primary">
                Vaccine Inventory
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              vaccine name: <strong>{vaccineName}</strong>
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            {/* DATE */}
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  slotProps={{
                    textField: {
                      margin: "normal",
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* QUANTITY */}
            <Grid item xs={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </Grid>
            {/* BATCH NUMBER */}
            <Grid item xs={2}>
              <TextField
                margin="normal"
                fullWidth
                id="batchNumber"
                label="Batch Number"
                name="batchNumber"
                value={batchNumber}
                onChange={handleBatchNumberChange}
              />
            </Grid>
            {/* EXPIRATION DATE */}
            <Grid item xs={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={handleExpirationDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  slotProps={{
                    textField: {
                      margin: "normal",
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {/* TRANSACTION TYPE */}
            <Grid item xs={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="transaction-type-label">
                  Transaction Type
                </InputLabel>
                <Select
                  labelId="transaction-type-label"
                  id="transaction-type"
                  value={transactionType}
                  label="Transaction Type"
                  onChange={handleTransactionTypeChange}
                >
                  <MenuItem value="STOCK IN">STOCK IN</MenuItem>
                  <MenuItem value="STOCK OUT">STOCK OUT</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick()}
                sx={{ marginTop: "16px" }}
              >
                Add to Stock
              </Button>
            </Grid>
          </Grid>
          <Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Batch Number</TableCell>
                    <TableCell>Expiration Date</TableCell>
                    <TableCell>Transaction Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vaccines
                    .sort(
                      (a, b) =>
                        new Date(b.transaction_date) -
                        new Date(a.transaction_date)
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.transaction_id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor:
                            row.transaction_type === "STOCK IN"
                              ? "primary.light"
                              : "inherit",
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.transaction_date}
                        </TableCell>
                        <TableCell>{row.transaction_quantity}</TableCell>
                        <TableCell>{row.batch_number}</TableCell>
                        <TableCell>{row.expiration_date}</TableCell>
                        <TableCell>{row.transaction_type}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={vaccines.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Details;
