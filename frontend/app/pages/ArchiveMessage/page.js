"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { ArrowBack, Restore, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function ArchivePage() {
  const router = useRouter();
  const [archivedMessages, setArchivedMessages] = useState([
    { id: 1, subject: "Mary Jane", content: "Hello, I would like to know the schedule for my baby’s next immunization." },
    { id: 2, subject: "Jane", content: "Hi, my baby missed the last immunization. Can I reschedule?" },
    { id: 3, subject: "Claire", content: "Are there any vaccines available for my 6-month-old baby this week?"},
  ]);

  const handleRestore = (id) => {
    setArchivedMessages((prev) => prev.filter((msg) => msg.id !== id));
    // You can implement logic to move it back to the main inbox
    console.log(`Message with id ${id} restored.`);
  };

  const handleDelete = (id) => {
    setArchivedMessages((prev) => prev.filter((msg) => msg.id !== id));
    console.log(`Message with id ${id} permanently deleted.`);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "50px", position: 'relative' }}>
      <IconButton
        onClick={() => router.replace("/pages/Inbox")}
        color="primary"
        sx={{
          position: 'fixed',
          top: 16,
          left: 190,
          zIndex: 1000,
        }}
      >
        <ArrowBack />
      </IconButton>
      <Container fixed>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary">
            Archived Messages
          </Typography>

          {archivedMessages.length === 0 ? (
            <Typography>No archived messages</Typography>
          ) : (
            archivedMessages.map((message) => (
              <Paper key={message.id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">{message.subject}</Typography>
                <Typography variant="body1">{message.content}</Typography>

                {/* Restore and Delete Buttons */}
                <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Restore />}
                    onClick={() => handleRestore(message.id)}
                  >
                    Restore
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(message.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Container>
    </Box>
  );
}
