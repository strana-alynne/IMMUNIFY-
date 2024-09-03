"use client";
import {
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(true);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        width: "100%",
        maxWidth: "390px",
        backgroundColor: "#f0f4f8", // Light blue-gray background
        padding: "16px",
      }}
    >
     
      <Paper
      
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          textAlign: "center",
          position: "relative",
          backgroundColor: "#ffffff", // White background for the paper
        }}
      >
         <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ mb: 4 }} // Margin bottom for spacing
      >
        <img
          src="/logo-wordmark.png" // Path to your IMMUNIFY logo
          alt="IMMUNIFY Logo"
          width="150"
          style={{ marginBottom: "16px" }} // Space between the logo and the paper
        />
      </Stack>
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#1976d2", // Blue color for the back button
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box mt={4}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
            Account Information
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "#555" }}>
            Please consult your barangay health worker for your account. If you are not registered, please visit onsite to register an account.
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          Please consult your barangay health worker for your account. If you
          are not registered, please visit onsite to register an account.
        </Alert>
      </Snackbar>
    </main>
  );
}
