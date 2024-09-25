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
  IconButton,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import {
  fetchVaccineStock,
  addVaccineStock,
  updateVaccineStock,
  getInventoryTotal,
} from "@/utils/supabase/api";
import { useState, useEffect } from "react";
import {
  ArrowBack,
  CheckCircle,
  DriveFileRenameOutline,
} from "@mui/icons-material";
import EditModal from "@/app/components/Modals/EditModal";
import GeneralModals from "@/app/components/Modals/Modals";
import { useRouter } from "next/navigation";
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
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [total, setTotal] = useState();
  const router = useRouter();

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleEditCloseModal = () => {
    setOpenEditModal(false);
  };
  const handleEdit = (transaction) => {
    setEditingTransaction({
      transaction_id: transaction.transaction_id,
      transaction_date: dayjs(transaction.transaction_date),
      transaction_type: transaction.transaction_type,
      transaction_quantity: transaction.transaction_quantity,
      batch_number: transaction.batch_number,
      expiration_date: dayjs(transaction.expiration_date),
    });
    setOpenEditModal(true);
  };

  //TABLE THINGSSS
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdate = async (updatedTransaction) => {
    // Perform update logic here (e.g., send the updated transaction to the server)
    updateVaccineStock(updatedTransaction);

    // After updating, refresh the vaccine stock list
    const updatedVaccines = await fetchVaccineStock(inventoryID);
    setVaccines(updatedVaccines);
  };

  // LOADS THE DATA
  useEffect(() => {
    async function loadVaccines() {
      const storedVaccineName = localStorage.getItem("selectedVaccineName");
      const storeInventoryId = localStorage.getItem("inventoryID");
      const fetchTotal = localStorage.getItem("vaccineID");
      const fetchedVaccines = await fetchVaccineStock(storeInventoryId);
      const fetchInvetory = await getInventoryTotal(fetchTotal);
      console.log("Vaccines loaded in component:", fetchedVaccines);
      console.log("Invetories loaded in component:", fetchInvetory);
      setVaccineName(storedVaccineName);
      setInventoryID(storeInventoryId);
      setVaccines(fetchedVaccines);
      setTotal(fetchInvetory);
    }
    loadVaccines();
  }, [params.id]);

  //BUTTON CLICK
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

    const result = await addVaccineStock(vaccineStockDetails);
    setOpenModal(true);
    if (result) {
      console.log("Vaccine stock added successfully:", result);
      const updatedVaccines = await fetchVaccineStock(inventoryID);
      setVaccines(updatedVaccines);
    } else {
      console.error("Failed to add vaccine stock.");
    }
  };

  //TEXTFIELDS HANDLER
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

  const handleBack = () => {
    router.replace(`/pages/VaccineInventory`);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction={"column"}>
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={handleBack}>
                <ArrowBack sx={{ fontSize: 40 }} color="primary" />
              </IconButton>
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
                    <TableCell></TableCell>
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
                        <TableCell>
                          {" "}
                          <IconButton>
                            <DriveFileRenameOutline
                              onClick={() => handleEdit(row)}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow sx={{ backgroundColor: "secondary.light" }}>
                    <TableCell colSpan={4} />
                    <TableCell colSpan={1}>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="left">
                      <strong>{total}</strong>
                    </TableCell>
                  </TableRow>
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
        <GeneralModals
          open={openModal}
          onClose={handleCloseModal}
          title={<CheckCircle color="primary" sx={{ fontSize: 80 }} />}
          content={<Typography>Successfully added Vaccine Stock</Typography>}
        />
        <EditModal
          open={openEditModal}
          onClose={handleEditCloseModal}
          title="Edit Vaccine Stock"
          transaction={editingTransaction}
          onUpdate={handleUpdate}
        />
      </Container>
    </Box>
  );
};

export default Details;
