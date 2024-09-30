"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  VaccinesOutlined,
  ArrowBack,
  CheckCircle,
  Add,
  Edit,
  Inventory2,
  Delete,
  DeleteForever,
} from "@mui/icons-material";
import EditModal from "@/app/components/Modals/EditModal";
import GeneralModals from "@/app/components/Modals/Modals";
import {
  fetchVaccineStock,
  addVaccineStock,
  updateVaccineStock,
  getInventoryTotal,
  checkVaccineStock,
  delVaccine,
} from "@/utils/supabase/api";

const Details = ({ params }) => {
  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [expirationDate, setExpirationDate] = useState(dayjs());
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [inventoryID, setInventoryID] = useState(params.id);
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [total, setTotal] = useState(0);
  const [actions, setActions] = useState();
  const [filterModel, setFilterModel] = useState({
    items: [
      { field: "transaction_date", operator: "contains", value: "" },
      { field: "transaction_type", operator: "equals", value: "" },
    ],
  });
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [VacId, setVacId] = useState("");

  useEffect(() => {
    async function loadVaccines() {
      const storedVaccineName = localStorage.getItem("selectedVaccineName");
      const storeInventoryId = localStorage.getItem("inventoryID");
      const fetchTotal = localStorage.getItem("vaccineID");
      const fetchedVaccines = await fetchVaccineStock(storeInventoryId);
      const fetchInventory = await getInventoryTotal(fetchTotal);
      setVacId(fetchTotal);
      setVaccineName(storedVaccineName);
      setInventoryID(storeInventoryId);
      setVaccines(fetchedVaccines);
      setTotal(fetchInventory);
    }
    loadVaccines();
  }, [params.id]);

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenAddModal = () => setOpenAddModal(true);
  const [modalContent, setModalContent] = useState("");
  const [title, setTitle] = useState("");
  const [modeIcon, setModeIcon] = useState("");

  const handleEdit = (transaction) => {
    setEditingTransaction({
      transaction_id: transaction.id,
      transaction_date: dayjs(transaction.transaction_date),
      transaction_type: transaction.transaction_type,
      transaction_quantity: transaction.transaction_quantity,
      batch_number: transaction.batch_number,
      expiration_date: dayjs(transaction.expiration_date),
    });
    setOpenEditModal(true);
  };

  const handleUpdate = async (updatedTransaction) => {
    await updateVaccineStock(updatedTransaction);
    const updatedVaccines = await fetchVaccineStock(inventoryID);
    setVaccines(updatedVaccines);
  };

  const handleDelete = async (delTransaction) => {
    console.log(
      "Transaction",
      inventoryID,
      delTransaction.transaction_id,
      delTransaction.transaction_type,
      delTransaction.transaction_quantity
    );

    await delVaccine(
      inventoryID,
      delTransaction.transaction_id,
      delTransaction.transaction_type,
      delTransaction.transaction_quantity
    );
    const fetchInventory = await getInventoryTotal(VacId);
    const updatedVaccines = await fetchVaccineStock(inventoryID);
    setVaccines(updatedVaccines);
    setTotal(fetchInventory);
    setOpenModal(false);
  };

  const handleDelModal = async (transaction) => {
    console.log(transaction);
    setModalContent(
      "This will delete the transaction from the inventory. Are you sure?"
    );
    setModeIcon(<DeleteForever color="error" sx={{ fontSize: 100 }} />);
    setTitle(
      <Typography color="error" variant="h6">
        Are you sure?
      </Typography>
    );
    setOpenModal(true);
    setActions(
      <Box display="flex">
        <Button
          style={{ marginRight: "8px" }}
          variant="contained"
          color="info"
          onClick={handleCloseModal}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(transaction)}
        >
          Yes
        </Button>
      </Box>
    );
  };

  const handleAddTransaction = async () => {
    console.log("click");
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const exFormattedDate = expirationDate.format("YYYY-MM-DD");
    const vaccineStockDetails = {
      transaction_date: formattedDate,
      transaction_type: transactionType,
      transaction_quantity: parseInt(quantity, 10),
      batch_number: batchNumber,
      expiration_date: exFormattedDate,
      inventory_id: inventoryID,
    };

    if (transactionType === "STOCK OUT") {
      const stock = await checkVaccineStock(VacId, parseInt(quantity, 10));
      console.log("stock", stock);

      if (!stock) {
        // Insufficient stock
        setOpenAddModal(false);
        setModalContent(
          "Insufficient vaccine stock. Please check your vaccine inventory."
        );
        setOpenModal(true);
        setModeIcon(<Inventory2 color="error" sx={{ fontSize: 64 }} />);
        setTitle("No Stock Available");
        return; // Exit early
      }
    }

    // Proceed to add transaction since stock is sufficient
    const result = await addVaccineStock(vaccineStockDetails);
    if (!result) {
      // Success: stock added
      const updatedVaccines = await fetchVaccineStock(inventoryID);
      setVaccines(updatedVaccines);
      setOpenAddModal(false);
      setModalContent("Vaccine stock added successfully.");
      setModeIcon(<CheckCircle color="primary" sx={{ fontSize: 80 }} />);
      setOpenModal(true);
      setTitle("Vaccine Stock Added");
    } else {
      // Failure to add stock
      console.error("Failed to add vaccine stock.");
      setOpenAddModal(false);
      setModalContent("Failed to add stock for unknown reasons.");
      setOpenModal(true);
      setModeIcon(<Inventory2 color="error" sx={{ fontSize: 64 }} />);
      setTitle("Error Adding Stock");
    }
  };

  const columns = [
    { field: "transaction_id", headerName: "Transaction ID", width: 200 },
    { field: "transaction_date", headerName: "Date", flex: 1 },
    { field: "transaction_quantity", headerName: "Quantity", flex: 1 },
    { field: "batch_number", headerName: "Batch Number", flex: 1 },
    { field: "expiration_date", headerName: "Expiration Date", flex: 1 },
    { field: "transaction_type", headerName: "Transaction Type", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelModal(params.row)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  const mobileColumns = columns.filter((col) =>
    ["transaction_date", "transaction_quantity", "transaction_type"].includes(
      col.field
    )
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => router.replace("/pages/VaccineInventory")}
            >
              <ArrowBack />
            </IconButton>
            <VaccinesOutlined sx={{ fontSize: 40 }} color="primary" />
            <Typography variant={isMobile ? "h6" : "h4"} color="primary">
              Vaccine Inventory:{" "}
              <span style={{ color: "#EE7423" }}>{vaccineName}</span>
            </Typography>
          </Stack>
          {/* MAIN PAGE MODAL */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleOpenAddModal}
            >
              Add Transaction
            </Button>
          </Box>

          <Box
            sx={{
              height: 400,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flex: 1, overflow: "auto" }}>
              <DataGrid
                rows={vaccines}
                columns={isMobile ? mobileColumns : columns}
                pageSize={5}
                getRowId={(row) => row.transaction_id}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
                components={{ Toolbar: GridToolbar }}
                filterModel={filterModel}
                onFilterModelChange={(newModel) => setFilterModel(newModel)}
                autoHeight
                sx={{
                  "& .MuiDataGrid-main": { overflow: "auto" },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "lightgray", // Keeping original styling
                  },
                  "& .MuiDataGrid-cell": {
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  },
                }}
              />
            </Box>
          </Box>
          <Typography variant="h6" color="secondary">
            Available Stocks Left: <strong>{total}</strong>
          </Typography>
        </Stack>

        <Modal open={openAddModal} onClose={handleCloseAddModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              color="primary"
              gutterBottom
            >
              Add New Transaction
            </Typography>
            <Stack spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <TextField
                fullWidth
                label="Batch Number"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={(newDate) => setExpirationDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={transactionType}
                  label="Transaction Type"
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <MenuItem value="STOCK IN">STOCK IN</MenuItem>
                  <MenuItem value="STOCK OUT">STOCK OUT</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleAddTransaction}>
                Add Transaction
              </Button>
            </Stack>
          </Box>
        </Modal>

        <GeneralModals
          open={openModal}
          onClose={handleCloseModal}
          title={title}
          content={modalContent}
          icon={modeIcon}
          actions={actions}
        />

        <EditModal
          open={openEditModal}
          onClose={handleCloseEditModal}
          title="Edit Vaccine Stock"
          transaction={editingTransaction}
          onUpdate={handleUpdate}
        />
      </Container>
    </Box>
  );
};

export default Details;
