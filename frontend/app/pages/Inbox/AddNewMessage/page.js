"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Send } from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";

export default function AddNewMessage() {
  const router = useRouter();
  const [availableMothers, setAvailableMothers] = useState([]);
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [errors, setErrors] = useState({ recipient: false, message: false });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const [user, setUser] = useState(null);

  // Fetch user and available mothers on component mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user.id); // Store the user ID
      }
    };
    getUser();
    fetchAvailableMothers();
  }, []);

  const validateFields = () => {
    const errors = {
      recipient: !recipient,
      message: message === "",
    };
    setErrors(errors);
    return !errors.recipient && !errors.message;
  };

  const fetchAvailableMothers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("Mother")
      .select("mother_id, mother_name");

    if (data) {
      setAvailableMothers(data);
    } else if (error) {
      console.error("Error fetching available mothers:", error);
    }
    setIsLoading(false);
  };

  const startNewConversation = async (bhw_id, mother_id) => {
    // Create or find an existing conversation between the sender and recipient
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert([{ bhw_id: bhw_id, mother_id: mother_id }])
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
    return conversation.conversation_id; // Return the conversation ID
  };

  const sendMessage = async (conversation_id, bhw_id, messageContent) => {
    const { error } = await supabase.from("messages").insert([
      {
        conversation_id,
        sender_id: bhw_id,
        recipient_id: recipient.mother_id,
        content: messageContent,
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (validateFields()) {
      try {
        // Step 1: Create a new conversation or get an existing one
        const conversation_id = await startNewConversation(
          user,
          recipient.mother_id
        );

        // Step 2: Send the message in the context of the conversation
        await sendMessage(conversation_id, user, message);

        console.log("Message sent successfully!");
        // Optional: Navigate to chat or reset form
        router.replace(`page/Inbox/${recipient.mother_id}`);
      } catch (error) {
        console.error("Error handling message:", error);
      }
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
              <Autocomplete
                options={availableMothers}
                getOptionLabel={(option) => option.mother_name}
                loading={isLoading}
                value={recipient}
                onChange={(event, newValue) => setRecipient(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Recipient"
                    fullWidth
                    error={errors.recipient}
                    helperText={errors.recipient ? "Recipient is required" : ""}
                  />
                )}
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
