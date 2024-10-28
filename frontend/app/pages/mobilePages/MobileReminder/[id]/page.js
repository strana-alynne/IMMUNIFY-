"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchReminderById } from "@/utils/supabase/supabaseClient";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import MobileSideBar from "@/app/components/MobileSideBar";
import AppBarMobile from "@/app/components/AppBarMobile";
import AppBarReminder from "@/app/components/AppBarReminder";
// Reminder Detail Page Component
export default function MobileReadR() {
  const [reminder, setReminder] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { id: reminderId } = useParams(); // Get the ID from dynamic URL

  useEffect(() => {
    const fetchReminder = async () => {
      if (reminderId) {
        const { success, data } = await fetchReminderById(reminderId);
        if (success) {
          setReminder(data);
        } else {
          console.error("Failed to fetch reminder details.");
        }
      }
    };

    fetchReminder();
  }, [reminderId]);

  // Toggle Sidebar Drawer
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
      <Box sx={{ flexGrow: 1 }}>
        <AppBarReminder />
        {reminder ? (
          <Container>
            <Typography variant="h4" color="primary" gutterBottom>
              {reminder.title}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {new Date(reminder.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" gutterBottom color="primary">
              {reminder.description}
            </Typography>
          </Container>
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            Loading...
          </Typography>
        )}
      </Box>
    </Box>
  );
}
