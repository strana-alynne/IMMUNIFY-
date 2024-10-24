"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { viewReminders } from "@/utils/supabase/supabaseClient";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MobileSideBar from "@/app/components/MobileSideBar";
import AppBarMobile from "@/app/components/AppBarMobile";
import { BellDotIcon } from "lucide-react";
import { useUser } from "@/app/lib/UserContext";

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const previousRemindersRef = useRef([]);
  const user = useUser();

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

  // Function to fetch reminders from Supabase
  const refreshReminders = async () => {
    const response = await viewReminders();
    if (response.success) {
      // Check for new reminders
      const newReminders = response.data.filter(
        (newReminder) =>
          !previousRemindersRef.current.some(
            (prevReminder) => prevReminder.id === newReminder.id
          )
      );

      // Filter new reminders to only include those created today
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const todaysReminders = newReminders.filter((reminder) => {
        const createdAt = new Date(reminder.created_at);
        return createdAt >= startOfDay && createdAt < endOfDay;
      });

      // Trigger notifications for today's new reminders
      if (todaysReminders.length > 0) {
        todaysReminders.forEach((reminder) => {
          triggerNotification(reminder);
        });
      }

      // Update previous reminders reference
      previousRemindersRef.current = response.data;

      // Only set reminders if they changed
      if (
        JSON.stringify(previousRemindersRef.current) !==
        JSON.stringify(reminders)
      ) {
        setReminders(response.data);
      }
    }
  };

  // Trigger Browser Push Notification
  const triggerNotification = (reminder) => {
    if (Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: BellDotIcon, // Customize your notification icon
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(reminder.title, {
            body: reminder.description,
            icon: BellDotIcon, // Customize your notification icon
          });
        }
      });
    }
  };

  useEffect(() => {
    // Request notification permission on component mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    refreshReminders(); // Fetch reminders on initial load
    const intervalId = setInterval(refreshReminders, 200); // Example: Refresh every minute

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []); // Empty dependency array ensures this runs once on mount

  const handleRowClick = (id) => {
    router.push(`/pages/mobilePages/MobileReadR/${id}`);
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
      <Box sx={{ flexGrow: 1 }}>
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
                            {new Date(reminder.created_at).toDateString()}
                          </Typography>
                          <Typography variant="body2">
                            {reminder?.content?.length > 500
                              ? `${reminder.content.substring(0, 500)}...`
                              : reminder.content || ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
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
