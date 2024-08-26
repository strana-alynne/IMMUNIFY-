"use client";
import React from "react";
import {

    Grid,
  TextField,

} from "@mui/material";

export default function Motherinfo() {
  return (
    <Grid container spacing={2}>
      {/* EMAIL */}
    <Grid item xs={6}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Email Address"
        name="email"
        autoFocus
      />
    </Grid>
    <Grid item xs={6}></Grid>

    {/* FIRST NAME */}
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
    {/* LAST NAME */}
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
    {/* AGE */}
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
    {/* TYPE of BIRTH */}
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Type of Birth"
        name="gender"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}></Grid>
    {/* NAME OF FACILITY */}
    <Grid item xs={4}>
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
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Type of Facility"
        name="type-facility"
        autoFocus
      />
    </Grid>
    <Grid item xs={4}></Grid>
    {/* ATTENDING */}
    <Grid item xs={4}>
      <TextField
        variant="filled"
        size="small"
        fullWidth
        id="outlined-size-small"
        label="Attending Personnel"
        name="attending-person"
        autoFocus
      />
    </Grid>
  </Grid>
  )
}
