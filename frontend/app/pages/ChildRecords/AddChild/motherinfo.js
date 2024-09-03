"use client";
import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function Motherinfo() {
  const [birthType, setBirthType] = useState();
  const [facility, setFacility] = useState();
  const [attending, setAttending] = useState();

  const handleBirthType = (event) => {
    setBirthType(event.target.value);
  };

  const handleFacility = (event) => {
    setFacility(event.target.value);
  };

  const handleAttending = (event) => {
    setAttending(event.target.value);
  };
  return (
    <Grid container spacing={2}>
      {/* EMAIL */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Email Address
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="e.g. name@email.com"
          name="email"
          autoFocus
        />
      </Grid>

      {/* CONTACT NUMBER */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Contact Number
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="e.g. 09123456789"
          name="contactNumber"
          autoFocus
          type="number"
        />
      </Grid>

      {/* FIRST NAME */}
      <Grid item xs={5}>
        <Typography variant="p" color="darker">
          First Name
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="First Name"
          name="firstname"
          autoFocus
        />
      </Grid>

      {/* LAST NAME */}
      <Grid item xs={5}>
        <Typography variant="p" color="darker">
          Last Name
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Last Name"
          name="lastname"
          autoFocus
        />
      </Grid>

      {/* AGE */}
      <Grid item xs={2}>
        <Typography variant="p" color="darker">
          Age
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Age"
          name="age"
          autoFocus
          type="number"
        />
      </Grid>

      {/* TYPE of BIRTH */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Type of Birth
        </Typography>
        <FormControl fullWidth variant="filled">
          <InputLabel id="gender-label">Type of Birth</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={birthType}
            label="Gender"
            onChange={handleBirthType}
          >
            <MenuItem value="Normal Delivery">Normal Delivery</MenuItem>
            <MenuItem value="C-section">C-section</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* NAME OF FACILITY */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Name of the Facility
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Name of Facility"
          name="type-facility"
          autoFocus
        />
      </Grid>

      {/* TPYE OF FACILITY */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Type of Facility
        </Typography>
        <FormControl fullWidth variant="filled">
          <InputLabel id="gender-label">Type of Facility</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={facility}
            label="Gender"
            onChange={handleFacility}
          >
            <MenuItem value="Government">Government</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* ATTENDING */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Attending Personnel
        </Typography>
        <FormControl fullWidth variant="filled">
          <InputLabel id="gender-label">Attending Personnel</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={attending}
            label="Gender"
            onChange={handleAttending}
          >
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="Midwife">Midwife</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
