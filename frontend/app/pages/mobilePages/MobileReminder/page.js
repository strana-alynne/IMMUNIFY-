"use client";
import React, { useState, useEffect, useRef } from "react";
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
import { createClient } from "@/utils/supabase/client";

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const previousRemindersRef = useRef([]);
  const supabase = createClient();
  const user = useUser();

  const toggleDrawer = (open) => (event) => {
    if (
      event?.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  // Function to fetch reminders from Supabase
  const refreshReminders = async () => {
    const { data, error } = await viewReminders();
    if (error) {
      console.error("Error viewing reminders:", error.message, error.details);
      return;
    }

    previousRemindersRef.current = data;
    setReminders(data);
  };

  // Trigger Browser Push Notification
  const triggerNotification = (reminder) => {
    if (Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: BellDotIcon,
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(reminder.title, {
            body: reminder.description,
            icon: BellDotIcon,
          });
        }
      });
    }
  };

  useEffect(() => {
    const initReminders = async () => {
      await refreshReminders();
      setIsLoading(false);
    };

    initReminders();

    // Set up real-time subscription for reminders
    const channel = supabase
      .channel(`realtime:reminders`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reminders" },
        async (payload) => {
          console.log("Real-time event received:", payload);

          // Trigger notification for new reminders
          if (payload.eventType === "INSERT") {
            triggerNotification(payload.new);
          }

          // Refresh the entire page using router.refresh()
          router.refresh();

          // Additionally refresh the reminders data
          await refreshReminders();
        }
      )
      .subscribe((status, err) => {
        if (err) console.error("Subscription error:", err);
        console.log("Subscription status:", status);
      });

    // Clean up the subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleRowClick = (id) => {
    console.log("id", id);
    router.push(`/pages/mobilePages/MobileReminder/${id}`);
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
                            {reminder.content?.length > 500
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
