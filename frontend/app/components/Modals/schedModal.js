import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField, Modal } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function SchedModal({
  title,
  age,
  open,
  onClose,
  transaction,
  onUpdate,
}) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [record, setRecord] = useState("");

  useEffect(() => {
    console.log(transaction);
    if (transaction) {
      setSelectedDate(dayjs(transaction.date_administered));
      setRecord(transaction.record_id);
    }
  }, [transaction]);

  const handleUpdate = async () => {
    const updatedTransaction = {
      date_administered: selectedDate.format("YYYY-MM-DD"),
      record_id: record,
    };
    console.log("update", updatedTransaction);
    await onUpdate(updatedTransaction);
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
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          color="black"
        >
          Age: {age}
        </Typography>
        <Typography
          id="modal-modal-title"
          variant="p"
          component="h2"
          color="black"
          fontSize="large"
        >
          Vacceine Name: {title}
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
