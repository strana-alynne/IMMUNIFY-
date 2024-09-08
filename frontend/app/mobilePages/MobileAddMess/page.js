"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function AddNewMessage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");


  const handleSend = () => {
    // Handle sending the message (e.g., save it to the backend)
    console.log("Sending message:", { recipient, subject, content });
    router.push("mobilePages/MobileInbox"); // Redirect to the inbox page
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push("")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            New Message
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ padding: "16px" }}>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: 1,
            padding: "16px",
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Compose New Message
          </Typography>
          <TextField
            fullWidth
            label="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Message Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={6}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
          >
            Send
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
