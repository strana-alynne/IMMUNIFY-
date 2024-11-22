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
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/navigation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import MobileSideBar from "@/app/components/MobileSideBar";
import AppBarMobile from "@/app/components/AppBarMobile";
import { BellDotIcon } from "lucide-react";
import { useUser } from "@/app/lib/UserContext";
import { createClient } from "@/utils/supabase/client";

export default function ReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [open, setOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState("default");
  const [fallbackAlert, setFallbackAlert] = useState({
    show: false,
    message: "",
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
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
    try {
      const { data, error } = await viewReminders();
      if (error) {
        console.error("Error viewing reminders:", error.message, error.details);
        return;
      }
      previousRemindersRef.current = data;
      setReminders(data);
    } catch (error) {
      console.error("Error refreshing reminders:", error);
      setFallbackAlert({
        show: true,
        message: "Failed to load reminders. Please try again.",
      });
    }
  };

  // Check if the browser supports notifications
  const checkNotificationSupport = () => {
    return "Notification" in window && "serviceWorker" in navigator;
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    try {
      if (!checkNotificationSupport()) {
        setFallbackAlert({
          show: true,
          message: "Notifications are not supported in this browser.",
        });
        return false;
      }

      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        setIsSubscribed(true);
        setFallbackAlert({
          show: true,
          message: "Notifications enabled successfully!",
        });
      } else {
        setFallbackAlert({
          show: true,
          message: "Please enable notifications to receive reminder alerts.",
        });
      }

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setFallbackAlert({
        show: true,
        message: "Failed to set up notifications. Please try again.",
      });
      return false;
    }
  };

  // Function to show notification
  const showNotification = async (reminder) => {
    try {
      // First try service worker notification
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(reminder.title, {
          body: reminder.content,
          icon: "/notification-icon.png",
          badge: "/notification-badge.png",
          vibrate: [200, 100, 200],
          tag: `reminder-${reminder.id}`,
          data: {
            url:
              window.location.origin +
              `/pages/mobilePages/MobileReminder/${reminder.id}`,
            reminderId: reminder.id,
          },
          actions: [
            {
              action: "view",
              title: "View Reminder",
            },
            {
              action: "dismiss",
              title: "Dismiss",
            },
          ],
          requireInteraction: true,
        });
        return;
      }

      // Fallback to regular notification API
      if (Notification.permission === "granted") {
        new Notification(reminder.title, {
          body: reminder.content,
          icon: "/notification-icon.png",
        });
      } else {
        setFallbackAlert({
          show: true,
          message: `New Reminder: ${reminder.title}`,
        });
      }
    } catch (error) {
      console.error("Error showing notification:", error);
      setFallbackAlert({
        show: true,
        message: `New Reminder: ${reminder.title}`,
      });
    }
  };

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/notification-sw.js", { scope: "/" })
        .then(async (registration) => {
          console.log("ServiceWorker registration successful");

          // Check if already subscribed
          const permission = await Notification.permission;
          setIsSubscribed(permission === "granted");
        })
        .catch((err) => {
          console.error("ServiceWorker registration failed:", err);
        });
    }

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

          if (payload.eventType === "INSERT") {
            showNotification(payload.new);
          }

          router.refresh();
          await refreshReminders();
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error("Subscription error:", err);
          setFallbackAlert({
            show: true,
            message: "Failed to subscribe to real-time updates.",
          });
        }
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleRowClick = (id) => {
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

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          mb={2}
        >
          <Typography variant="h4" color="primary">
            Reminders
          </Typography>
          <IconButton
            onClick={requestNotificationPermission}
            color={isSubscribed ? "primary" : "default"}
            title={
              isSubscribed ? "Notifications enabled" : "Enable notifications"
            }
          >
            {isSubscribed ? <NotificationsIcon /> : <NotificationsOffIcon />}
          </IconButton>
        </Stack>

        <Container>
          <Grid container spacing={2}>
            {isLoading ? (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  Loading reminders...
                </Typography>
              </Grid>
            ) : reminders.length > 0 ? (
              reminders.map((reminder) => (
                <Grid item xs={12} key={reminder.id}>
                  <Card
                    onClick={() => handleRowClick(reminder.id)}
                    sx={{
                      cursor: "pointer",
                      boxShadow: 3,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <NotificationsIcon fontSize="large" color="primary" />
                        <Box>
                          <Typography variant="h6">{reminder.title}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(reminder.created_at).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              mt: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {reminder.content || ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  No reminders available.
                </Typography>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={fallbackAlert.show}
        autoHideDuration={6000}
        onClose={() => setFallbackAlert({ show: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFallbackAlert({ show: false, message: "" })}
          severity="info"
          sx={{ width: "100%" }}
        >
          {fallbackAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
