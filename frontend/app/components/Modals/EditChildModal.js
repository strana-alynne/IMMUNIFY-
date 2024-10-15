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

const purok = [
  "Farland 1",
  "Farland 2",
  "Farlandville",
  "Country Homes",
  "New Creation",
  "DLF",
  "Macleod",
  "Rasay",
  "Sison",
  "Back of Pepsi",
  "Greenland",
  "Maharlika",
  "Pag-ibig",
  "Philbanking",
  "Dusnai",
  "Sto. Rosario",
  "Paderog",
  "Mangrubang",
  "Dumoy Proper",
  "Iwha",
  "Pepsi Village",
  "Medalla",
  "Leonor",
  "Dacoville 1",
  "Dacoville 2",
  "Don Lorenzo",
  "Espino Kalayaan",
];

const EditChildModal = ({ open, onClose, childData, onSave }) => {
  const [editedData, setEditedData] = useState({
    child_name: "",
    gender: "",
    birthdate: null,
    address: "",
    purok: "",
  });

  useEffect(() => {
    if (childData) {
      setEditedData({
        child_name: childData.child_name,
        gender: childData.gender,
        birthdate: dayjs(childData.birthdate),
        address: childData.address,
        purok: childData.Purok.purok_name,
      });
    }
  }, [childData]);

  const handleChangeName = (field) => (event) => {
    setEditedData({ ...editedData, [field]: event.target.value });
  };
  const handleGenderChange = (field) => (event) => {
    setEditedData({ ...editedData, [field]: event.target.value });
  };
  const handleAddressChnage = (field) => (event) => {
    setEditedData({ ...editedData, [field]: event.target.value });
  };
  const handlePurokChange = (field) => (event) => {
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
          onChange={handleChangeName("child_name")}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Gender</InputLabel>
          <Select
            value={editedData.gender}
            onChange={handleGenderChange("gender")}
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
          onChange={handleAddressChnage("address")}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Purok</InputLabel>
          <Select
            value={editedData.purok}
            onChange={handlePurokChange("purok")}
            label="Purok"
          >
            {purok.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
