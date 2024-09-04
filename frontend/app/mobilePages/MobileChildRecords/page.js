"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Stack,
  Avatar,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import MobileSideBar from "@/app/components/MobileSideBar/page"; // Importing MobileSideBar

export default function ChildRecords() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sample child data
  const [children, setChildren] = useState([
    { id: 1, name: "Sarah Johnson", age: "12 months", status: "Completed" },
    { id: 2, name: "John Doe", age: "11 months", status: "Partial" },
    // More children can be added here
  ]);

  const handleAddChild = () => {
    router.push("/pages/MobileAddChild");
  };

  const handleViewDetails = (id) => {
    router.push(`/pages/MobileChildView/${id}`);
  };

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
          <img
            src="/logo-wordmark.png"
            alt="IMMUNIFY logo"
            style={{ width: "50px" }}
          />
        </IconButton>

        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          Child Records
        </Typography>

        <Grid container spacing={2} marginLeft={0.5}>
          {children.map((child) => (
            <Grid item xs={11} key={child.id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{child.name[0]}</Avatar>
                    <Box>
                      <Typography variant="h6">{child.name}</Typography>
                      <Typography variant="body2">Age: {child.age}</Typography>
                      <Typography variant="body2">
                        Status: {child.status}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(child.id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddChild}
          sx={{ mt: 4, width: "50%", ml: "75px" }}
        >
          Add New Child
        </Button>
      </Box>
    </Box>
  );
}
