import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const EditMotherModal = ({ open, onClose, motherData, onSave }) => {
  const [editedData, setEditedData] = useState({
    mother_name: motherData?.mother_name || "",
    mother_age: motherData?.mother_age || "",
    contact_number: motherData?.contact_number || "",
    mother_email: motherData?.mother_email || "",
    relationship: motherData?.relationship || "",
  });

  // Relationship options
  const relationshipOptions = [
    "Mother",
    "Father",
    "Guardian",
    "Grandmother",
    "Grandfather",
    "Aunt",
    "Uncle",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(editedData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Guardian's Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian's Name"
              name="mother_name"
              value={editedData.mother_name}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Guardian's Age"
              name="mother_age"
              value={editedData.mother_age}
              onChange={handleChange}
              type="number"
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="relationship-label">Relationship</InputLabel>
              <Select
                labelId="relationship-label"
                id="relationship"
                name="relationship"
                value={editedData.relationship}
                onChange={handleChange}
                label="Relationship"
              >
                {relationshipOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Contact Number"
              name="contact_number"
              value={editedData.contact_number}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="mother_email"
              value={editedData.mother_email}
              onChange={handleChange}
              type="email"
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMotherModal;
