"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import MobileSideBar from "@/app/components/MobileSideBar/page";

export default function AddChild() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = () => {
    // Logic to save the new child (e.g., API call or updating local state)
    console.log("New child added:", { name, age, status });
    router.push("/ChildRecords");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "390px",
        backgroundColor: "#ffffff",
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
          <img
            src="/logo-wordmark.png"
            alt="IMMUNIFY logo"
            style={{ width: "50px" }}
          />
        </IconButton>

        {/* Header with Back Button */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginBottom: "16px" }}
        >
          <IconButton
            onClick={() => router.back()}
            sx={{ color: "primary.main" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" color="primary">
            Add New Child
          </Typography>
        </Stack>

        <Stack spacing={2} width="90%" marginLeft={2}>
          <TextField
            label="Child's Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
          />
          <TextField
            label="Vaccination Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 4 }}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
