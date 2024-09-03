"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Grid,
  IconButton,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MobileSideBar from "../MobileSideBar/page";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";

const reminders = [
  { id: 1, title: "Upcoming Vaccination", date: new Date(2024, 8, 15), content: "Don’t forget Sarah’s vaccination on September 15 at 10:00 AM.", status: "Pending" },
  { id: 2, title: "Bakuna Event", date: new Date(2024, 8, 20), content: "Join the Bakuna event on September 20 at the community center.", status: "Pending" },
  { id: 3, title: "Missed Vaccination", date: new Date(2024, 8, 10), content: "Sarah missed her vaccination on September 10. Please reschedule.", status: "Missed" },
];

export default function ReminderPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleRowClick = (id) => {
    router.replace(`/pages/MReminders/${id}`);
  };

  const getChipColor = (status) => {
    switch (status) {
      case "Pending":
        return { backgroundColor: "primary.light", color: "primary.dark" };
      case "Missed":
        return { backgroundColor: "error.light", color: "error.dark" };
      default:
        return "default";
    }
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
      <MobileSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{ flexGrow: 1, paddingLeft: sidebarOpen ? "240px" : "0", transition: "padding-left 0.3s" }}>
        <img
          src="/logo-wordmark.png"
          alt="IMMUNIFY logo"
          style={{
            width: "160px",
            margin: "16px 0",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        <Typography variant="h4" color="primary" gutterBottom textAlign="center">
          Reminders
        </Typography>

        <Container>
          <Grid container spacing={2}>
            {reminders.length > 0 ? (
              reminders.map((reminder) => (
                <Grid item xs={12} key={reminder.id}>
                  <Card
                    onClick={() => handleRowClick(reminder.id)}
                    sx={{ cursor: "pointer", boxShadow: 3 }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <NotificationsIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography variant="h6">{reminder.title}</Typography>
                          <Typography variant="body2">{reminder.date.toDateString()}</Typography>
                          <Typography variant="body2">
                            {reminder.content.length > 30
                              ? `${reminder.content.substring(0, 30)}...`
                              : reminder.content}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Chip label={reminder.status} sx={getChipColor(reminder.status)} />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(reminder.id);
                        }}
                        color="primary"
                      >
                        <InfoIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No reminders available.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
