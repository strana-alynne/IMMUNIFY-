"use client";
import React from "react";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Childinfo from "./childinfo";
import Motherinfo from "./motherinfo";
import { Check } from "@mui/icons-material";

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
              Child's Personal Information
            </Typography>
            <Childinfo />
          </Paper>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Mother's Personal Information
            </Typography>
            <Motherinfo />
          </Paper>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="contained" color="info"  xs={2}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" startIcon={<Check />} xs={2}>
              Save Record
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
