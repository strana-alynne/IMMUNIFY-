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
import { ArrowBack, Restore } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function DeletedPage() {
  const router = useRouter();
  const [deletedMessages, setDeletedMessages] = useState([
    {
      

       id: 1, subject: "Claire", content: "Are there any vaccines available for my 6-month-old baby this week?"

    },
  ]);

  const handleRestore = (id) => {
    setDeletedMessages((prev) => prev.filter((msg) => msg.id !== id));
    console.log(`Message with id ${id} restored.`);
    // You can implement logic to move it back to the main inbox
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
            Deleted Messages
          </Typography>

          {deletedMessages.length === 0 ? (
            <Typography>No deleted messages</Typography>
          ) : (
            deletedMessages.map((message) => (
              <Paper key={message.id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6">{message.subject}</Typography>
                <Typography variant="body1">{message.content}</Typography>

                {/* Restore Button */}
                <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Restore />}
                    onClick={() => handleRestore(message.id)}
                  >
                    Restore
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
