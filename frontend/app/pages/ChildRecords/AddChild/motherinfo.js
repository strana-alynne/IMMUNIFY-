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
  FormHelperText,
} from "@mui/material";

export default function Motherinfo({ setMotherData, triggerErrorCheck }) {
  const [mother_email, setEmail] = useState("");
  const [contact_number, setContactNumber] = useState();
  const [mfirstname, setMFirstName] = useState("");
  const [mlastname, setMLastname] = useState("");
  const [mother_age, setMAge] = useState();
  const [delivery_type, setBirthType] = useState("");
  const [facility_type, setFacility] = useState("");
  const [facility_name, setFacilityName] = useState("");
  const [attending, setAttending] = useState("");
  const [errors, setErrors] = useState({
    mother_email: "",
    contact_number: "",
    mfirstname: "",
    mlastname: "",
    mother_age: "",
    delivery_type: "",
    facility_type: "",
    facility_name: "",
    attending: "",
  });

  useEffect(() => {
    if (triggerErrorCheck) {
      validateFields();
    }
  }, [triggerErrorCheck]);

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
      hasErrors: Object.values(errors).some((error) => error !== ""),
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

  const validateFields = () => {
    const newErrors = {
      mother_email:
        mother_email.trim() === ""
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(mother_email)
          ? "Invalid email format"
          : "",
      contact_number:
        contact_number === ""
          ? "Contact number is required"
          : !/^[0-9]{11}$/.test(contact_number)
          ? "Invalid contact number"
          : "",
      mfirstname: mfirstname.trim() === "" ? "First name is required" : "",
      mlastname: mlastname.trim() === "" ? "Last name is required" : "",
      mother_age:
        mother_age === ""
          ? "Age is required"
          : isNaN(mother_age) || mother_age <= 0
          ? "Invalid age"
          : "",
      delivery_type: delivery_type === "" ? "Type of birth is required" : "",
      facility_type: facility_type === "" ? "Type of facility is required" : "",
      facility_name:
        facility_name.trim() === "" ? "Facility name is required" : "",
      attending: attending === "" ? "Attending personnel is required" : "",
    };
    setErrors(newErrors);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        mother_email:
          event.target.value.trim() === ""
            ? "Email is required"
            : !/\S+@\S+\.\S+/.test(event.target.value)
            ? "Invalid email format"
            : "",
      }));
    }
  };

  const handleContactNumber = (event) => {
    setContactNumber(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        contact_number:
          event.target.value.trim() === ""
            ? "Contact number is required"
            : !/^[0-9]{11}$/.test(event.target.value)
            ? "Invalid contact number"
            : "",
      }));
    }
  };

  const handleMFirstName = (event) => {
    setMFirstName(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        mfirstname:
          event.target.value.trim() === "" ? "First name is required" : "",
      }));
    }
  };

  const handleMLastName = (event) => {
    setMLastname(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        mlastname:
          event.target.value.trim() === "" ? "Last name is required" : "",
      }));
    }
  };

  const handleMAge = (event) => {
    setMAge(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        mother_age:
          event.target.value === ""
            ? "Age is required"
            : isNaN(event.target.value) || event.target.value <= 0
            ? "Invalid age"
            : "",
      }));
    }
  };

  const handleFacilityName = (event) => {
    setFacilityName(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        facility_name:
          event.target.value.trim() === "" ? "Facility name is required" : "",
      }));
    }
  };

  const handleBirthType = (event) => {
    setBirthType(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        delivery_type:
          event.target.value === "" ? "Type of birth is required" : "",
      }));
    }
  };

  const handleFacility = (event) => {
    setFacility(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        facility_type:
          event.target.value === "" ? "Type of facility is required" : "",
      }));
    }
  };

  const handleAttending = (event) => {
    setAttending(event.target.value);
    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        attending:
          event.target.value === "" ? "Attending personnel is required" : "",
      }));
    }
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
          error={!!errors.mother_email}
          helperText={errors.mother_email}
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
          type="tel"
          inputProps={{
            maxLength: 11,
            pattern: "[0-9]*",
          }}
          onInput={(e) => {
            e.target.value = e.target.value.slice(0, 11);
          }}
          value={contact_number}
          onChange={handleContactNumber}
          error={!!errors.contact_number}
          helperText={errors.contact_number}
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
          error={!!errors.mfirstname}
          helperText={errors.mfirstname}
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
          error={!!errors.mlastname}
          helperText={errors.mlastname}
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
          error={!!errors.mother_age}
          helperText={errors.mother_age}
        />
      </Grid>

      {/* TYPE of BIRTH */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Type of Birth
        </Typography>
        <FormControl fullWidth variant="filled" error={!!errors.delivery_type}>
          <InputLabel id="birth-type-label">Type of Birth</InputLabel>
          <Select
            labelId="birth-type-label"
            id="birth-type"
            value={delivery_type}
            label="Type of Birth"
            onChange={handleBirthType}
          >
            <MenuItem value="Normal Delivery">Normal Delivery</MenuItem>
            <MenuItem value="C-section">C-section</MenuItem>
          </Select>
          {errors.delivery_type && (
            <FormHelperText>{errors.delivery_type}</FormHelperText>
          )}
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
          name="facility_name"
          autoFocus
          value={facility_name}
          onChange={handleFacilityName}
          error={!!errors.facility_name}
          helperText={errors.facility_name}
        />
      </Grid>

      {/* TPYE OF FACILITY */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Type of Facility
        </Typography>
        <FormControl fullWidth variant="filled" error={!!errors.facility_type}>
          <InputLabel id="facility-type-label">Type of Facility</InputLabel>
          <Select
            labelId="facility-type-label"
            id="facility-type"
            value={facility_type}
            label="Type of Facility"
            onChange={handleFacility}
          >
            <MenuItem value="Government">Government</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
          </Select>
          {errors.facility_type && (
            <FormHelperText>{errors.facility_type}</FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* ATTENDING */}
      <Grid item xs={4}>
        <Typography variant="p" color="darker">
          Attending Personnel
        </Typography>
        <FormControl fullWidth variant="filled" error={!!errors.attending}>
          <InputLabel id="attending-label">Attending Personnel</InputLabel>
          <Select
            labelId="attending-label"
            id="attending"
            value={attending}
            label="Attending Personnel"
            onChange={handleAttending}
          >
            <MenuItem value="Doctor">Doctor</MenuItem>
            <MenuItem value="Midwife">Midwife</MenuItem>
          </Select>
          {errors.attending && (
            <FormHelperText>{errors.attending}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
}
