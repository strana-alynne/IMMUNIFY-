import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function EditModal({
  title,
  open,
  onClose,
  transaction,
  onUpdate,
}) {
  const [transactionType, setTransactionType] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [expirationDate, setExpirationDate] = useState(dayjs());
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  useEffect(() => {
    if (transaction) {
      setTransactionType(transaction.transaction_type);
      setSelectedDate(dayjs(transaction.transaction_date));
      setExpirationDate(dayjs(transaction.expiration_date));
      setQuantity(transaction.transaction_quantity);
      setBatchNumber(transaction.batch_number);
    }
  }, [transaction]);

  const handleUpdate = () => {
    const updatedTransaction = {
      ...transaction,
      transaction_date: selectedDate.format("YYYY-MM-DD"),
      transaction_type: transactionType,
      transaction_quantity: parseInt(quantity, 10),
      batch_number: batchNumber,
      expiration_date: expirationDate.format("YYYY-MM-DD"),
    };
    onUpdate(updatedTransaction);
    onClose();
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
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
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              margin="normal"
              fullWidth
              id="batchNumber"
              label="Batch Number"
              name="batchNumber"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </Grid>

          <Grid item xs={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiration Date"
                value={expirationDate}
                onChange={(newDate) => setExpirationDate(newDate)}
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
                onChange={(e) => setTransactionType(e.target.value)}
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
              onClick={handleUpdate}
              sx={{ marginTop: "16px" }}
            >
              Update Stock
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
