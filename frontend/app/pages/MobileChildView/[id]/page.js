"use client";
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import MobileSideBar from "../MobileSideBar/page"; // Importing MobileSideBar

export default function ChildDetails() {
  const router = useRouter();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Sample child data
  const children = [
    { id: 1, name: "Sarah Johnson", age: "12 months", bday: "12/24/2023", purok: "Farland", mother: "Maria Johnson", contact: "09564356754", status: "Completed" },
    { id: 2, name: "John Doe", age: "11 months", bday: "11/15/2023", purok: "Country Homes", mother: "Jane Doe", contact: "09564356754", status: "Partial" },
    // More children can be added here
  ];

  // Find the child by ID
  const child = children.find((c) => c.id === parseInt(id, 10));

  if (!child) {
    return <Typography>No child record found.</Typography>;
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "390px", // iPhone 12 Pro screen width
        backgroundColor: "#ffffff", // Set background color to white
        minHeight: "100vh",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar */}
      <MobileSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Toggle Sidebar Button */}
        <IconButton onClick={toggleSidebar} sx={{ marginBottom: "16px" }}>
          <img src="/logo-wordmark.png" alt="IMMUNIFY logo" style={{ width: "50px" }} />
        </IconButton>

        <Typography variant="h4" color="primary" gutterBottom textAlign="center">
          Child Details
        </Typography>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Avatar sx={{ width: 56, height: 56 }}>{child.name[0]}</Avatar>
              <Typography variant="h6">Name: {child.name}</Typography>
              <Typography variant="body2">Age: {child.age}</Typography>
              <Typography variant="body2">Birthday: {child.bday}</Typography>
              <Typography variant="body2">Purok: {child.purok}</Typography>
              <Typography variant="body2">Mother: {child.mother}</Typography>
              <Typography variant="body2">Contact: {child.contact}</Typography>
              <Typography variant="body2">Vaccination Status: {child.status}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
