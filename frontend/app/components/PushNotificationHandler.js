"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/lib/UserContext";
import { viewReminders } from "@/utils/supabase/supabaseClient";
import { BellDotIcon } from "lucide-react";

const PushNotificationHandler = () => {
  const [reminders, setReminders] = useState([]);
  const previousRemindersRef = useRef([]);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    // Request notification permission on component mount
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

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

    const intervalId = setInterval(refreshReminders, 200); // Example: Refresh every minute

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []); // Empty dependency array ensures this runs once on mount

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

  const handleRowClick = (id) => {
    router.push(`/pages/mobilePages/MobileReadR/${id}`);
  };

  return null; // This component doesn't render any UI, it's just handling the logic
};

export default PushNotificationHandler;
