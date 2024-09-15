"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Add, Archive, Delete, ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  // Sample messages
  const [messages, setMessages] = useState([
    { id: 1, subject: "Mary Jane", content: "Hello, I would like to know the schedule for my baby’s next immunization.", archived: false, deleted: false },
    { id: 2, subject: "Jane", content: "Hi, my baby missed the last immunization. Can I reschedule?", archived: false, deleted: false },
    { id: 3, subject: "Claire", content: "Are there any vaccines available for my 6-month-old baby this week?", archived: false, deleted: false },
  ]);

  const handleArchive = (id) => {
    setMessages(messages.map((msg) => msg.id === id ? { ...msg, archived: true } : msg));
  };

  const handleDelete = (id) => {
    setMessages(messages.map((msg) => msg.id === id ? { ...msg, deleted: true } : msg));
  };

  const handleAddNewMessage = () => {
    router.push("/pages/AddNewMessage");
  };

  const handleViewArchive = () => {
    router.push("/pages/ArchiveMessage");
  };

  const handleViewDeleted = () => {
    router.push("/pages/DeletedMessage");
  };

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary">
            Inbox - Immunization Inquiries
          </Typography>

          {/* Add, Archive, and Deleted buttons */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Add />}
                onClick={handleAddNewMessage}
              >
                Add New Message
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<Archive />}
                onClick={handleViewArchive}
              >
                View Archived Messages
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<Delete />}
                onClick={handleViewDeleted}
              >
                View Deleted Messages
              </Button>
            </Grid>
          </Grid>

          {/* Message List */}
          <Paper elevation={3} sx={{ marginTop: 3 }}>
            <List>
              {messages.filter(msg => !msg.archived && !msg.deleted).map((message) => (
                <ListItem key={message.id} button>
                  <ListItemText
                    primary={message.subject}
                    secondary={message.content}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleArchive(message.id)} aria-label="archive" color="secondary">
                      <Archive />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(message.id)} aria-label="delete" color="error">
                      <Delete />
                    </IconButton>
                    <IconButton aria-label="view" onClick={() => router.push(`/pages/ViewMessage?id=${message.id}`)}>
                      <ChevronRight />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
