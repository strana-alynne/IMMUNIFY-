"use client";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Send } from "@mui/icons-material";

export default function AddNewMessage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errors, setErrors] = useState({ recipient: false, message: false });

  const validateFields = () => {
    const errors = {
      recipient: recipient === "",
      message: message === "",
    };
    setErrors(errors);
    return !errors.recipient && !errors.message;
  };

  const handleSendMessage = () => {
    if (validateFields()) {
      console.log("Sending message:", message);
      console.log("To recipient:", recipient);

      // Here you would add the logic to add the new message
      router.replace("/pages/chat"); // Navigate back to the inbox
    }
  };

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary">
            Compose New Message
          </Typography>

          {/* Recipient Input */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Recipient"
                fullWidth
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                error={errors.recipient}
                helperText={errors.recipient ? "Recipient is required" : ""}
              />
            </Grid>
          </Grid>

          {/* Message Textfield */}
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Message"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={errors.message}
                helperText={errors.message ? "Message is required" : ""}
              />
            </Grid>
          </Grid>

          {/* Error Alert */}
          {(errors.recipient || errors.message) && (
            <Alert severity="error">Please fill out all required fields.</Alert>
          )}

          {/* Send Button */}
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Send />}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
