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
import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoIcon from "@mui/icons-material/Info";
import MobileSideBar from "@/app/components/MobileSideBar/page";
import AppBarMobile from "@/app/components/AppBarMobile";

const reminders = [
  {
    id: 1,
    title: "Upcoming Vaccination",
    date: new Date(2024, 8, 15),
    content: "Don’t forget Sarah’s vaccination on September 15 at 10:00 AM.",
    status: "Pending",
  },
  {
    id: 2,
    title: "Bakuna Event",
    date: new Date(2024, 8, 20),
    content: "Join the Bakuna event on September 20 at the community center.",
    status: "Pending",
  },
  {
    id: 3,
    title: "Missed Vaccination",
    date: new Date(2024, 8, 10),
    content: "Sarah missed her vaccination on September 10. Please reschedule.",
    status: "Missed",
  },
];

export default function ReminderPage() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

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
  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
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
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBarMobile toggleDrawer={toggleDrawer} />
        <MobileSideBar open={open} toggleDrawer={toggleDrawer} />
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
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
                          <Typography variant="body2">
                            {reminder.date.toDateString()}
                          </Typography>
                          <Typography variant="body2">
                            {reminder.content.length > 30
                              ? `${reminder.content.substring(0, 30)}...`
                              : reminder.content}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Chip
                        label={reminder.status}
                        sx={getChipColor(reminder.status)}
                      />
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
