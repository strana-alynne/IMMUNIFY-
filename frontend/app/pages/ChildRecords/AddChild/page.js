"use client";
import React from "react";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
    Grid,
  TextField,

} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";

export default function AddChild() {
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <FaceIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h2" color="primary">
                Child Records
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              + Add Child Record
            </Typography>
          </Stack>
          
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Child Personal Information
            </Typography>
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
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
