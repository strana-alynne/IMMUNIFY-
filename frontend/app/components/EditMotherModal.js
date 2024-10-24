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
} from "@mui/material";

const EditMotherModal = ({ open, onClose, motherData, onSave }) => {
  const [editedData, setEditedData] = useState({
    mother_name: motherData?.mother_name || "",
    mother_age: motherData?.mother_age || "",
    contact_number: motherData?.contact_number || "",
    mother_email: motherData?.mother_email || "",
    delivery_type: motherData?.delivery_type || "",
    attending: motherData?.attending || "",
    facility_name: motherData?.facility_name || "",
    facility_type: motherData?.facility_type || "",
  });

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
      <DialogTitle>Edit Mother's Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mother's Name"
              name="mother_name"
              value={editedData.mother_name}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mother's Age"
              name="mother_age"
              value={editedData.mother_age}
              onChange={handleChange}
              type="number"
              margin="dense"
            />
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Delivery Type"
              name="delivery_type"
              value={editedData.delivery_type}
              onChange={handleChange}
              margin="dense"
            >
              <MenuItem value="Normal Delivery">Normal Delivery</MenuItem>
              <MenuItem value="Caesarean Section">Caesarean Section</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Attending Doctor/Midwife"
              name="attending"
              value={editedData.attending}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Facility Name"
              name="facility_name"
              value={editedData.facility_name}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Facility Type"
              name="facility_type"
              value={editedData.facility_type}
              onChange={handleChange}
              margin="dense"
            >
              <MenuItem value="Government">Government</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
            </TextField>
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
