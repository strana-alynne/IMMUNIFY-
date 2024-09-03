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
  InputAdornment,
  OutlinedInput,
  FilledInput,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function childinfo() {
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
  ];
  const [genderVal, setGenderVal] = useState();
  const [birthdateVal, setBirthDateVal] = useState();
  const [purokName, setPurokName] = React.useState([]);

  const handlePurokChange = (event) => {
    const {
      target: { value },
    } = event;
    setPurokName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleGender = (event) => {
    setGenderVal(event.target.value);
  };
  const handleBirthDate = (newDate) => {
    setBirthDateVal(newDate);
  };
  return (
    <Grid container spacing={2}>
      {/* FIRST NAME */}
      <Grid item xs={6}>
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
      <Grid item xs={6}>
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
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Age
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="age in months"
          name="age"
          autoFocus
          type="number"
        />
      </Grid>

      {/* GENDER */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Gender
        </Typography>
        <FormControl fullWidth variant="filled">
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={genderVal}
            label="Gender"
            onChange={handleGender}
          >
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* BIRTHDATE */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Birthdate
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Birthdate"
            value={birthdateVal}
            onChange={handleBirthDate}
            renderInput={(params) => <TextField {...params} />}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                variant: "filled",
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      {/* COMPLETE ADDRESS */}
      <Grid item xs={8}>
        <Typography variant="p" color="darker">
          Complete Address
        </Typography>
        <TextField
          variant="filled"
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Complete Address"
          name="address"
          autoFocus
        />
      </Grid>

      {/* PUROK */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Purok
        </Typography>
        <FormControl fullWidth variant="filled">
          <InputLabel id="purok-label">Select Purok</InputLabel>
          <Select
            labelId="purok-label"
            id="purok"
            value={purokName}
            label="Purok"
            onChange={handlePurokChange}
          >
            {purok.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* HEIGHT */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Height
        </Typography>
        <FilledInput
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Height"
          name="height"
          autoFocus
          endAdornment={<InputAdornment position="end">cm</InputAdornment>}
        />
      </Grid>

      {/* WEIGHT */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Weight
        </Typography>
        <FilledInput
          size="small"
          fullWidth
          id="outlined-size-small"
          label="Weight"
          name="weight"
          autoFocus
          endAdornment={<InputAdornment position="end">kg</InputAdornment>}
        />
      </Grid>
    </Grid>
  );
}
