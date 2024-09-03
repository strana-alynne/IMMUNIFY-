"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function Motherinfo({ setMotherData }) {
  const [mother_email, setEmail] = useState();
  const [contact_number, setContactNumber] = useState();
  const [mfirstname, setMFirstName] = useState();
  const [mlastname, setMLastname] = useState();
  const [mother_age, setMAge] = useState();
  const [delivery_type, setBirthType] = useState();
  const [facility_type, setFacility] = useState();
  const [facility_name, setFacilityName] = useState();
  const [attending, setAttending] = useState();

  useEffect(() => {
    const mother_name = `${mfirstname} ${mlastname}`;
    setMotherData({
      mother_name,
      mother_age,
      facility_name,
      facility_type,
      delivery_type,
      attending,
      mother_email,
      contact_number,
    });
  }, [
    mfirstname,
    mlastname,
    mother_age,
    facility_name,
    facility_type,
    delivery_type,
    mother_email,
    contact_number,
    attending,
  ]);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleContactNumber = (event) => {
    setContactNumber(event.target.value);
  };

  const handleMFirstName = (event) => {
    setMFirstName(event.target.value);
  };

  const handleMLastName = (event) => {
    setMLastname(event.target.value);
  };

  const handleMAge = (event) => {
    setMAge(event.target.value);
  };

  const handleFacilityName = (event) => {
    setFacilityName(event.target.value);
  };

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
          type="email"
          value={mother_email}
          onChange={handleEmail}
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
          name="contact_number"
          autoFocus
          type="number"
          inputProps={{
            maxLength: 11,
            pattern: "[0-9]*", // ensures only numbers are input
          }}
          onInput={(e) => {
            if (e.target.value.length > 11) {
              e.target.value = e.target.value.slice(0, 11);
            }
          }}
          value={contact_number}
          onChange={handleContactNumber}
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
          value={mfirstname}
          onChange={handleMFirstName}
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
          value={mlastname}
          onChange={handleMLastName}
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
          value={mother_age}
          onChange={handleMAge}
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
            value={delivery_type}
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
          name="type-facility_type"
          autoFocus
          value={facility_name}
          onChange={handleFacilityName}
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
            value={facility_type}
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
