"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  IconButton,
  Chip,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FaceIcon from "@mui/icons-material/Face";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/navigation";
import MobileSideBar from "../MobileSideBar/page";

// Dummy data function
function createData(name, age, bday, purok, mother,contact, status, id) {
  return { name, age, bday, purok, mother, contact, status, id };
}

// Chip color function
const getChipColor = (status) => {
  switch (status) {
    case "Completed":
      return { backgroundColor: "primary.light", color: "primary.dark" };
    case "Partial":
      return { backgroundColor: "secondary.light", color: "secondary.dark" };
    case "Missed Schedule":
      return { backgroundColor: "error.light", color: "error.dark" };
    default:
      return "default";
  }
};

// Sample Data
const rows = [
  createData("Sarah Johnson", "12 months", "12/24/2023", "Farland", "Maria Johnson", "09564356754", "Completed", 1),
  createData("John Doe", "11 months", "11/15/2023", "Country Homes", "Jane Doe", "09564356754",  "Partial", 2),
  createData("Emily Smith", "10 months", "10/05/2023", "Greenland", "Anna Smith", "09564356754",  "Missed Schedule", 3),
];

export default function ChildRecords() {
  const router = useRouter();

  const handleRowClick = (id) => {
    router.replace(`/pages/ChildRecords/${id}`);
  };

  const handleEdit = (id) => {
    router.replace(`/pages/ChildRecords/EditChild/${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete functionality here
    console.log(`Delete record with ID: ${id}`);
  };

  const toggleSidebar = () => {
    router.replace(`/pages/MobileSideBar`);
    // Handle sidebar toggle functionality here
    console.log("Sidebar toggled");
  };

  return (
    <Box
    
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "390px", // iPhone 12 Pro screen width
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      {/* Top Bar */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
        <IconButton onClick={toggleSidebar}>
          <MenuIcon sx={{ color: "#1976d2" }} />
        </IconButton>
        <FaceIcon sx={{ fontSize: 40, color: "#1976d2" }} />
      </Stack>

      {/* Logo */}
      <img src="/logo-wordmark.png" alt="IMMUNIFY logo" style={{ width: "200px", margin: "16px 0" }} />

      {/* Child Records */}
      <Typography variant="h4" color="primary" gutterBottom>
        Child Records
      </Typography>

      <Container>
        <Grid container spacing={2}>
          {rows.map((row) => (
            <Grid item xs={12} key={row.id}>
              <Card onClick={() => handleRowClick(row.id)} sx={{ cursor: "pointer", boxShadow: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{row.name[0]}</Avatar>
                    <Box>
                      <Typography variant="h6">{row.name}</Typography>
                      <Typography variant="body2">{row.age}</Typography>
                      <Typography variant="body2">{row.bday}</Typography>
                      <Typography variant="body2">{row.purok}</Typography>
                      <Typography variant="body2">Mother: {row.mother}</Typography>
                      <Typography variant="body2">Contact Number: {row.contact}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
  <Chip label={row.status} sx={getChipColor(row.status)} />
  <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row.id); }} color="primary">
    <EditIcon />
  </IconButton>
  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} color="error">
    <DeleteIcon />
  </IconButton>
</CardActions>

              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
