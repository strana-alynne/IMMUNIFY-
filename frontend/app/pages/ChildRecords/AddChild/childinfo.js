"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  InputAdornment,
  FilledInput,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function childinfo({ setChildData, setPurok, setGrowthData }) {
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
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [child_age, setAge] = useState();
  const [gender, setGenderVal] = useState();
  const [birthdate, setBirthDateVal] = useState();
  const [address, setAddress] = useState("");
  const [purokName, setPurokName] = useState([]);
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();

  useEffect(() => {
    const child_name = `${firstname} ${lastname}`;
    setPurok(purokName);
    setGrowthData({
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
    });
    setChildData({
      child_name,
      child_age,
      gender,
      birthdate: birthdate ? dayjs(birthdate).format("YYYY-MM-DD") : null,
      address,
    });
  }, [
    firstname,
    lastname,
    child_age,
    gender,
    birthdate,
    address,
    purokName,
    height,
    weight,
  ]);

  const handlePurokChange = (event) => {
    const {
      target: { value },
    } = event;
    setPurokName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastname = (event) => {
    setLastName(event.target.value);
  };

  const handleAge = (event) => {
    setAge(event.target.value);
  };
  const handleAddress = (event) => {
    setAddress(event.target.value);
  };

  const handleGender = (event) => {
    setGenderVal(event.target.value);
  };
  const handleBirthDate = (newDate) => {
    setBirthDateVal(newDate);
  };

  const handleWeight = (event) => {
    setWeight(event.target.value);
  };

  const handleHeight = (event) => {
    setHeight(event.target.value);
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
          value={firstname}
          onChange={handleFirstName}
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
          value={lastname}
          onChange={handleLastname}
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
          value={child_age}
          onChange={handleAge}
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
            value={gender}
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
            value={birthdate}
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
          value={address}
          onChange={handleAddress}
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
          value={height}
          onChange={handleHeight}
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
          value={weight}
          onChange={handleWeight}
          endAdornment={<InputAdornment position="end">kg</InputAdornment>}
        />
      </Grid>
    </Grid>
  );
}
