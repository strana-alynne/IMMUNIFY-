"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const EditChildModal = ({ open, onClose, childData, onSave }) => {
  const [editedData, setEditedData] = useState({
    child_name: "",
    gender: "",
    birthdate: null,
    address: "",
  });

  useEffect(() => {
    if (childData) {
      setEditedData({
        child_name: childData.child_name,
        gender: childData.gender,
        birthdate: dayjs(childData.birthdate),
        address: childData.address,
      });
    }
  }, [childData]);

  const handleChange = (field) => (event) => {
    setEditedData({ ...editedData, [field]: event.target.value });
  };

  const handleDateChange = (date) => {
    setEditedData({ ...editedData, birthdate: date });
  };

  const handleSave = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Child Details</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Child Name"
          fullWidth
          value={editedData.child_name}
          onChange={handleChange("child_name")}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Gender</InputLabel>
          <Select
            value={editedData.gender}
            onChange={handleChange("gender")}
            label="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Birthdate"
            value={editedData.birthdate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="dense" />
            )}
          />
        </LocalizationProvider>
        <TextField
          margin="dense"
          label="Address"
          fullWidth
          value={editedData.address}
          onChange={handleChange("address")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChildModal;
