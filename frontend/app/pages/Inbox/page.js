"use client";
import React, { useState, useEffect } from "react";
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
import { Add, Delete, ChevronRight } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function MainPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [user, setUser] = useState(null);
  const [motherNames, setMotherNames] = useState({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("user", user.user_metadata.role);
        setUser(user.user_metadata.role);
        fetchConversations(user.user_metadata.role);
      }
    };
    fetchUserAndConversations();
  }, []);

  useEffect(() => {
    console.log("selectedConversation", selectedConversation);
    if (selectedConversation && user) {
      fetchMessages(selectedConversation, user.id);
      markMessagesAsRead(selectedConversation);
    }
  }, [selectedConversation, user]);

  const fetchConversations = async (user_id) => {
    console.log("fetching conversations", user_id);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user_id}, recipient_id.eq.${user_id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error.message);
      throw error;
    }

    const conversations = {};
    data.forEach((message) => {
      const person_id =
        message.sender_id === user_id
          ? message.recipient_id
          : message.sender_id;
      if (!conversations[person_id]) {
        conversations[person_id] = {
          id: person_id,
          messages: [],
        };
      }
      conversations[person_id].messages.push(message);
    });

    console.log("conversations", conversations);
    const conversationsList = Object.values(conversations);
    setConversations(conversationsList);

    // Fetch mother names for all recipients
    conversationsList.forEach(async (conversation) => {
      const recipientId = conversation.id;
      console.log("recipientId", recipientId);
      await fetchMotherName(recipientId);
    });
  };

  const fetchMotherName = async (motherId) => {
    const { data, error } = await supabase
      .from("Mother")
      .select("mother_name")
      .eq("mother_id", motherId)
      .single();

    if (data) {
      setMotherNames((prev) => ({
        ...prev,
        [motherId]: data.mother_name,
      }));
    } else if (error) {
      console.error("Error fetching mother name:", error);
      setMotherNames((prev) => ({
        ...prev,
        [motherId]: "Unknown Mother",
      }));
    }
  };

  const handleDelete = (id) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, deleted: true } : msg))
    );
  };

  const handleAddNewMessage = () => {
    router.push("/pages/Inbox/AddNewMessage");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Typography variant="h4" color="primary">
            Inbox - Immunization Inquiries
          </Typography>

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
          </Grid>

          <Paper elevation={3} sx={{ marginTop: 3 }}>
            <List>
              {conversations.map((message) => {
                const recipientId = message.id;
                const motherName = motherNames[recipientId] || "Loading...";

                return (
                  <ListItem
                    key={message.id}
                    button
                    onClick={() => router.push(`/pages/Inbox/${message.id}`)}
                  >
                    <ListItemText
                      primary={motherName}
                      secondary={message.messages[0].content}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleDelete(message.id)}
                        aria-label="delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                      <IconButton
                        aria-label="view"
                        onClick={() =>
                          router.push(`/pages/Inbox/${message.id}`)
                        }
                      >
                        <ChevronRight />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
