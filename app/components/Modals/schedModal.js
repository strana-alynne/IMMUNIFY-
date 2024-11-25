"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Modal,
  Link,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Delete } from "@mui/icons-material";

export default function SchedModal({
  title,
  child,
  age,
  open,
  onClose,
  transaction,
  onUpdate,
  onDelete,
}) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [record, setRecord] = useState("");
  const [status, setStatus] = useState("");
  const [originalStatus, setOriginalStatus] = useState("");

  useEffect(() => {
    console.log("child", child);
    if (transaction) {
      setSelectedDate(dayjs(transaction.date_administered));
      setRecord(transaction.record_id);
      setStatus(transaction.status);
      setOriginalStatus(transaction.status);
    }
  }, [transaction]);

  const handleUpdate = async () => {
    console.log("status", status);
    if (originalStatus === "Missed") {
      const updatedTransaction = {
        date_administered: selectedDate.format("YYYY-MM-DD"),
        record_id: record,
        status: status,
      };
      await onUpdate(updatedTransaction);
    } else {
      const updatedTransaction = {
        date_administered: selectedDate.format("YYYY-MM-DD"),
        record_id: record,
      };
      await onUpdate(updatedTransaction);
    }
    setOriginalStatus(status);
    onClose();
  };

  const handleDelete = async () => {
    const deleteTransaction = {
      record_id: record,
      vaccine_id: title,
      child_id: child,
    };
    await onDelete(deleteTransaction);
    onClose();
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
        <Box sx={{ alignSelf: "flex-end" }}>
          <Link
            underline="none"
            color="error"
            onClick={handleDelete}
            sx={{ fontSize: "0.875rem", display: "flex", alignItems: "center" }}
          >
            <Delete sx={{ fontSize: "0.875rem" }} /> Delete Record?
          </Link>
        </Box>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          color="black"
          sx={{ alignSelf: "flex-start" }}
        >
          Age: {age}
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="p"
          component="h2"
          color="black"
          fontSize="large"
          sx={{ alignSelf: "flex-start" }}
        >
          Vaccine Name: {title}
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
          {(originalStatus === "Missed" || status === "Missed") && (
            <Grid item xs={2}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Missed">Missed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              sx={{ marginTop: "16px" }}
            >
              Update Record
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
