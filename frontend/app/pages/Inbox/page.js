"use client";
import React, { useState } from "react";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import MailIcon from "@mui/icons-material/Mail";
import AddIcon from "@mui/icons-material/Add";

export default function Inbox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "James",
      subject: "Welcome to the Platform",
      preview: "Thank you for joining us! We’re excited to have you on board...",
      date: "2024-09-01",
      read: false,
      archived: false,
    },
    {
      id: 2,
      sender: "Platform Support",
      subject: "Your Weekly Update",
      preview: "Here’s what’s new this week. Don’t miss out on the latest features...",
      date: "2024-08-25",
      read: true,
      archived: false,
    },
    {
      id: 3,
      sender: "Jane Gorg",
      subject: "Account Verification",
      preview: "Please verify your email address by clicking on the link...",
      date: "2024-08-20",
      read: true,
      archived: false,
    },
  ]);

  const handleDelete = (id) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  const handleArchive = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, archived: !message.archived } : message
      )
    );
  };

  const handleMarkAsRead = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, read: true } : message
      )
    );
  };

  const handleAddMessage = () => {
    const newMessage = {
      id: messages.length + 1,
      sender: "New Sender",
      subject: "New Message Subject",
      preview: "This is a preview of the new message...",
      date: new Date().toISOString().split("T")[0],
      read: false,
      archived: false,
    };
    setMessages([newMessage, ...messages]);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <SideBar />
      <Container fixed>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Inbox
          </Typography>
          <Fab color="primary" aria-label="add" onClick={handleAddMessage}>
            <AddIcon />
          </Fab>
        </Box>
        <List>
          {messages
            .filter((message) => !message.archived)
            .map((message) => (
              <React.Fragment key={message.id}>
                <ListItem
                  button
                  onClick={() => handleMarkAsRead(message.id)}
                  sx={{
                    backgroundColor: message.read ? "#f0f0f0" : "#e3f2fd",
                    "&:hover": {
                      backgroundColor: message.read ? "#e0e0e0" : "#bbdefb",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ bgcolor: message.read ? "#90caf9" : "#1e88e5" }}
                    >
                      <MailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={message.subject}
                    secondary={`${message.sender} - ${message.preview}`}
                  />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 2 }}
                  >
                    {message.date}
                  </Typography>
                  <Tooltip title="Archive">
                    <IconButton
                      edge="end"
                      aria-label="archive"
                      onClick={() => handleArchive(message.id)}
                    >
                      <ArchiveIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(message.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
        </List>
      </Container>
    </Box>
  );
}
