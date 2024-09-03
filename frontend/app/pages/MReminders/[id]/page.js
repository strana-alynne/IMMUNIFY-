"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import MobileSideBar from "../../MobileSideBar/page";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const reminders = [
  { id: 1, title: "Upcoming Vaccination", date: new Date(2024, 8, 15), content: "Don’t forget Sarah’s vaccination on September 15 at 10:00 AM.", status: "Pending" },
  { id: 2, title: "Bakuna Event", date: new Date(2024, 8, 20), content: "Join the Bakuna event on September 20 at the community center.", status: "Pending" },
  { id: 3, title: "Missed Vaccination", date: new Date(2024, 8, 10), content: "Sarah missed her vaccination on September 10. Please reschedule.", status: "Missed" },
];

export default function ReminderDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Assuming id is passed as a route param
  const reminder = reminders.find((r) => r.id === parseInt(id));

  if (!reminder) {
    return <Typography>No reminder found.</Typography>;
  }
  const handleBackClick = () => {
    router.back(); // Navigate back to the previous page
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
      <MobileSideBar open={false} onClose={() => {}} />

      <Box sx={{ flexGrow: 1, paddingLeft: "0", transition: "padding-left 0.3s" }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <IconButton
          onClick={handleBackClick}
      
        >
          <ArrowBackIcon />
        </IconButton>
          <Typography variant="h5" color="primary">
            {reminder.title}
          </Typography>
        </Stack>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {reminder.date.toDateString()}
            </Typography>
            <Typography variant="body1">{reminder.content}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
