"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Fab,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from "@mui/icons-material/Archive";
import MailIcon from "@mui/icons-material/Mail";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MobileSideBar from "@/app/components/MobileSideBar/page";
import AppBarMobile from "@/app/components/AppBarMobile";

export default function InboxPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "James",
      subject: "Welcome to the Platform",
      preview: "Thank you for joining us! We’re excited to have you on board...",
      content: "Welcome to the platform! We're excited to have you with us. If you have any questions, feel free to contact us.",
      date: "2024-09-01",
      read: false,
      archived: false,
      deleted: false,
    },
    {
      id: 2,
      sender: "Platform Support",
      subject: "Your Weekly Update",
      preview: "Here’s what’s new this week. Don’t miss out on the latest features...",
      content: "Here’s what’s new this week. We have several updates to improve your experience.",
      date: "2024-08-25",
      read: true,
      archived: false,
      deleted: false,
    },
    {
      id: 3,
      sender: "Jane Gorg",
      subject: "Account Verification",
      preview: "Please verify your email address by clicking on the link...",
      content: "Please verify your email address by clicking the link below. This is required to activate your account.",
      date: "2024-08-20",
      read: true,
      archived: false,
      deleted: false,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("inbox"); // 'inbox', 'archived', 'deleted'
  const [selectedMessage, setSelectedMessage] = useState(null); // Message clicked to view
  const [replyText, setReplyText] = useState("");

  const handleDelete = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, deleted: true } : message
      )
    );
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
        router.push('/mobilePages/MobileAddMess/'); // Redirect to the New Message page
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

  // Handle when a message is clicked
  const handleViewMessage = (message) => {
    handleMarkAsRead(message.id);
    setSelectedMessage(message);
  };

  // Go back to Inbox
  const handleBackToInbox = () => {
    setSelectedMessage(null);
    setReplyText(""); // Reset reply text
  };

  // Handle reply text change
  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const filteredMessages = messages.filter((message) => {
    if (filter === "inbox") return !message.archived && !message.deleted;
    if (filter === "archived") return message.archived && !message.deleted;
    if (filter === "deleted") return message.deleted;
    return false;
  });

  return (
    <Box>
      <AppBarMobile toggleDrawer={toggleDrawer} />
      <MobileSideBar open={open} toggleDrawer={toggleDrawer} />

      <Box sx={{ flexGrow: 1, padding: "16px", boxSizing: "border-box" }}>
        {selectedMessage ? (
          // View Message Page
          <Box>
            <IconButton onClick={handleBackToInbox} sx={{ mb: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Box
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: 1,
                mb: 2,
              }}
            >
              <Typography variant="h5" color="primary" gutterBottom>
                {selectedMessage.subject}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                From: {selectedMessage.sender}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Date: {selectedMessage.date}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                {selectedMessage.content}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {/* Reply Section */}
              <Typography variant="h6" gutterBottom>
                Reply
              </Typography>
              <TextField
                fullWidth
                placeholder="Write your reply..."
                multiline
                minRows={3}
                value={replyText}
                onChange={handleReplyChange}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                Send Reply
              </Button>
            </Box>
          </Box>
        ) : (
          // Inbox Page
          <Box>
            {/* Menu Section */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Button
                variant={filter === "inbox" ? "contained" : "outlined"}
                onClick={() => setFilter("inbox")}
              >
                Inbox
              </Button>
              <Button
                variant={filter === "archived" ? "contained" : "outlined"}
                onClick={() => setFilter("archived")}
              >
                Archived
              </Button>
              <Button
                variant={filter === "deleted" ? "contained" : "outlined"}
                onClick={() => setFilter("deleted")}
              >
                Deleted
              </Button>
            </Stack>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h4" color="primary" gutterBottom>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Typography>
              <Fab
                color="primary"
                aria-label="add"
                onClick={handleAddMessage}
                sx={{ position: "fixed", bottom: 16, right: 16 }}
              >
                <AddIcon />
              </Fab>
            </Box>

            <List>
              {filteredMessages.length === 0 ? (
                <Typography>No messages found.</Typography>
              ) : (
                filteredMessages.map((message) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      button
                      onClick={() => handleViewMessage(message)}
                      sx={{
                        backgroundColor: message.read ? "#f0f0f0" : "#e3f2fd",
                        "&:hover": {
                          backgroundColor: message.read
                            ? "#e0e0e0"
                            : "#bbdefb",
                        },
                        borderRadius: 2,
                        mb: 1,
                        p: 1,
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
                      {/* Delete and Archive Buttons */}
                      <Tooltip title="Archive">
                        <IconButton
                          edge="end"
                          aria-label="archive"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            handleArchive(message.id);
                          }}
                        >
                          <ArchiveIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            handleDelete(message.id);
                          }}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              )}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
}
