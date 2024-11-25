import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Chip,
  Button,
  Modal,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Add as AddIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const BatchTransactionModal = ({
  open,
  onClose,
  batchNumber,
  onAddTransaction,
}) => {
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [quantity, setQuantity] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSubmit = () => {
    onAddTransaction({
      transaction_date: transactionDate.format("YYYY-MM-DD"),
      transaction_type: transactionType,
      transaction_quantity: parseInt(quantity, 10),
      batch_number: batchNumber,
      remarks: remarks,
    });
    handleClose();
  };

  const handleClose = () => {
    setTransactionDate(dayjs());
    setQuantity("");
    setTransactionType("");
    setRemarks("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2" color="primary" gutterBottom>
          Add Transaction for Batch {batchNumber}
        </Typography>
        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Transaction Date"
              value={transactionDate}
              onChange={(newDate) => setTransactionDate(newDate)}
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

          <TextField
            fullWidth
            label="Remarks"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!quantity || !transactionType}
          >
            Add Transaction
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

const BatchRow = ({ batch, transactions, onAddTransaction }) => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const totalQuantity = transactions.reduce((sum, transaction) => {
    return (
      sum +
      (transaction.transaction_type === "STOCK IN"
        ? transaction.transaction_quantity
        : -transaction.transaction_quantity)
    );
  }, 0);

  const latestExpirationDate = transactions.reduce((latest, transaction) => {
    return latest > transaction.expiration_date
      ? latest
      : transaction.expiration_date;
  }, transactions[0].expiration_date);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography fontWeight="bold">{batch}</Typography>
        </TableCell>
        <TableCell align="right">
          <Chip
            label={`${totalQuantity} units`}
            color={totalQuantity > 0 ? "success" : "error"}
            variant="outlined"
          />
        </TableCell>
        <TableCell>{latestExpirationDate}</TableCell>
        <TableCell>{transactions.length} transactions</TableCell>
        <TableCell>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            onClick={() => setModalOpen(true)}
          >
            Add Transaction
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                color="primary"
              >
                Transaction History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell>Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.transaction_id}>
                      <TableCell component="th" scope="row">
                        {transaction.transaction_date}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.transaction_type}
                          color={
                            transaction.transaction_type === "STOCK IN"
                              ? "primary"
                              : "secondary"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {transaction.transaction_quantity}
                      </TableCell>
                      <TableCell>{transaction.remarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <BatchTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        batchNumber={batch}
        onAddTransaction={onAddTransaction}
      />
    </>
  );
};

const CollapsibleVaccineTable = ({ vaccines, onAddTransaction }) => {
  const [groupedVaccines, setGroupedVaccines] = useState({});

  useEffect(() => {
    // Group vaccines by batch number
    const grouped = vaccines.reduce((acc, vaccine) => {
      const batch = vaccine.batch_number;
      if (!acc[batch]) {
        acc[batch] = [];
      }
      acc[batch].push(vaccine);
      return acc;
    }, {});
    setGroupedVaccines(grouped);
  }, [vaccines]);

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <Typography fontWeight="bold">Batch Number</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">Total Quantity</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Expiration Date</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Transactions</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight="bold">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedVaccines).map(
            ([batchNumber, transactions]) => (
              <BatchRow
                key={batchNumber}
                batch={batchNumber}
                transactions={transactions}
                onAddTransaction={onAddTransaction}
              />
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollapsibleVaccineTable;
