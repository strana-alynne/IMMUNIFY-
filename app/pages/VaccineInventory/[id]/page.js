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
  subscribeToVaccineTransactions,
} from "@/utils/supabase/api";
import ExportDialog from "@/app/components/ExportDialog";
import CollapsibleVaccineTable from "@/app/components/CollapsibleVaccineTable";

const VACCINE_COVERAGE = {
  "BCG (Bacillus-Calmette-Guerin)": 10,
  "Hepatitis B": 10,
  "Penta: DTwP-HepBHib": 1,
  "PCV (Pneumococcal Conjugate Vaccine)": 4,
  "OPV (Oral Polio Vaccine)": 20,
  "IPV (Inactive Polio Vaccine)": 10,
  "MMR (Measles - Mumps - Rubella Vaccine)": 10,
};
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
  const [babiesCovered, setBabiesCovered] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [VacId, setVacId] = useState("");

  const loadData = async (storeInventoryId, vaccineId, storedVaccineName) => {
    const fetchedVaccines = await fetchVaccineStock(storeInventoryId);
    const fetchInventory = await getInventoryTotal(vaccineId);
    const coverageRatio = VACCINE_COVERAGE[storedVaccineName] || 0;
    const calculatedBabiesCovered = fetchInventory * coverageRatio;

    setVaccines(fetchedVaccines);
    setTotal(fetchInventory);
    setBabiesCovered(calculatedBabiesCovered);
  };

  useEffect(() => {
    async function initializeData() {
      const storedVaccineName = localStorage.getItem("selectedVaccineName");
      const storeInventoryId = localStorage.getItem("inventoryID");
      const fetchTotal = localStorage.getItem("vaccineID");

      setVacId(fetchTotal);
      setVaccineName(storedVaccineName);
      setInventoryID(storeInventoryId);

      // Initial data load
      await loadData(storeInventoryId, fetchTotal, storedVaccineName);

      // Set up real-time subscription
      const sub = subscribeToVaccineTransactions(
        storeInventoryId,
        async (payload) => {
          console.log("Realtime update payload:", payload);
          await loadData(storeInventoryId, fetchTotal, storedVaccineName);
        }
      );

      setSubscription(sub);
    }

    initializeData();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [params.id]);

  const handleCloseModal = () => setOpenModal(false);
  const handleCloseAddModal = () => {
    resetFormFields();
    setOpenAddModal(false);
  };
  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenAddModal = () => setOpenAddModal(true);
  const [modalContent, setModalContent] = useState("");
  const [title, setTitle] = useState("");
  const [modeIcon, setModeIcon] = useState("");
  const [remarks, setRemarks] = useState("");
  const handleEdit = (transaction) => {
    console.log("Edit", transaction);
    setEditingTransaction({
      transaction_id: transaction.transaction_id,
      transaction_date: dayjs(transaction.transaction_date),
      transaction_type: transaction.transaction_type,
      transaction_quantity: transaction.transaction_quantity,
      batch_number: transaction.batch_number,
      expiration_date: dayjs(transaction.expiration_date),
      inventory_id: transaction.inventory_id,
    });
    setOpenEditModal(true);
  };

  const handleUpdate = async (updatedTransaction) => {
    await updateVaccineStock(updatedTransaction);
    const updatedVaccines = await fetchVaccineStock(inventoryID);
    setVaccines(updatedVaccines);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const resetFormFields = () => {
    setSelectedDate(dayjs());
    setExpirationDate(dayjs());
    setQuantity("");
    setBatchNumber("");
    setRemarks("");
    setTransactionType("");
  };

  const handleDelete = async (delTransaction) => {
    try {
      setDeletingTransaction(delTransaction);
      await delVaccine(
        inventoryID,
        delTransaction.transaction_id,
        delTransaction.transaction_type,
        delTransaction.transaction_quantity
      );

      // Immediately refresh data after deletion
      const storedVaccineName = localStorage.getItem("selectedVaccineName");
      await loadData(inventoryID, VacId, storedVaccineName);

      setModalContent("Transaction deleted successfully");
      setModeIcon(<CheckCircle color="success" sx={{ fontSize: 80 }} />);
      setTitle("Success");
      setActions(
        <Button variant="contained" color="primary" onClick={handleClose}>
          Ok
        </Button>
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setModalContent("Failed to delete transaction");
      setModeIcon(<Inventory2 color="error" sx={{ fontSize: 64 }} />);
      setTitle("Error");
    } finally {
      setDeletingTransaction(null);
      setOpenModal(false);
    }
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
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    const exFormattedDate = expirationDate.format("YYYY-MM-DD");
    const vaccineStockDetails = {
      transaction_date: formattedDate,
      transaction_type: "STOCK IN",
      transaction_quantity: parseInt(quantity, 10),
      batch_number: batchNumber,
      expiration_date: exFormattedDate,
      inventory_id: inventoryID,
      remarks: remarks,
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
      // Success adding stock
      await loadData(inventoryID, VacId, vaccineName);
      setOpenAddModal(false);
      setModalContent("Vaccine stock added successfully.");
      setModeIcon(<CheckCircle color="primary" sx={{ fontSize: 80 }} />);
      setOpenModal(true);
      setTitle("Vaccine Stock Added");
      setActions(
        <Button variant="contained" color="primary" onClick={handleClose}>
          Ok
        </Button>
      );
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
    { field: "remarks", headerName: "Remarks", flex: 1 },
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
              Add Batch
            </Button>
            <ExportDialog vaccines={vaccines} vaccineName={vaccineName} />
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
              <CollapsibleVaccineTable
                vaccines={vaccines}
                onAddTransaction={async (transactionDetails) => {
                  const vaccineStockDetails = {
                    ...transactionDetails,
                    inventory_id: inventoryID,
                    expiration_date: expirationDate.format("YYYY-MM-DD"),
                  };

                  if (transactionDetails.transaction_type === "STOCK OUT") {
                    const stock = await checkVaccineStock(
                      VacId,
                      parseInt(transactionDetails.transaction_quantity, 10)
                    );
                    if (!stock) {
                      setModalContent(
                        "Insufficient vaccine stock. Please check your vaccine inventory."
                      );
                      setOpenModal(true);
                      setModeIcon(
                        <Inventory2 color="error" sx={{ fontSize: 64 }} />
                      );
                      setTitle("No Stock Available");
                      return;
                    }
                  }

                  const result = await addVaccineStock(vaccineStockDetails);
                  if (!result) {
                    await loadData(inventoryID, VacId, vaccineName);
                    setModalContent("Transaction added successfully.");
                    setModeIcon(
                      <CheckCircle color="primary" sx={{ fontSize: 80 }} />
                    );
                    setOpenModal(true);
                    setTitle("Transaction Added");
                    setActions(
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                      >
                        Ok
                      </Button>
                    );
                  } else {
                    setModalContent(
                      "Failed to add transaction for unknown reasons."
                    );
                    setOpenModal(true);
                    setModeIcon(
                      <Inventory2 color="error" sx={{ fontSize: 64 }} />
                    );
                    setTitle("Error Adding Transaction");
                  }
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="secondary">
              Available Stocks Left: <strong>{total}</strong>
            </Typography>
            <Typography variant="h6" color="primary">
              Babies Covered: <strong>{babiesCovered}</strong>
            </Typography>
          </Box>
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
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter any additional notes or comments"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={(newDate) => setExpirationDate(newDate)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <TextField
                disabled
                fullWidth
                label="Transaction Type"
                value="STOCK IN"
              />
              <Button variant="contained" onClick={handleAddTransaction}>
                Add Batch
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
