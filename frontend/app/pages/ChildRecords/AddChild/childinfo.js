"use client";
import React from "react";
import {

    Grid,
  TextField,

} from "@mui/material";

export default function childinfo() {
  return (
    <Grid container spacing={2}>
    <Grid item xs={6}>
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
    <Grid item xs={6}>
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
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Age"
        name="age"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Gender"
        name="gender"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Date"
        name="date"
        autoFocus
      />
    </Grid>
    <Grid item xs={8}>
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
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Select a Purok"
        name="purok"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Height"
        name="height"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Weight"
        name="weight"
        autoFocus
      />
    </Grid>
  </Grid>
  )
}
