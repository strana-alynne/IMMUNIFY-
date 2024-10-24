"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Stack,
} from "@mui/material";
import { ArrowBackIos, Send } from "@mui/icons-material";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const ChatInterface = ({ params }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [availableMothers, setAvailableMothers] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user and conversation data on load
  useEffect(() => {
    const initChat = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user.user_metadata.role);
        await fetchConversation(user.user_metadata.role, params.id);
        fetchAvailableMothers(params.id);
      }
      setIsLoading(false);
    };

    initChat();
  }, [params.id]);

  // Set up subscription whenever conversationId changes
  useEffect(() => {
    if (!conversationId) return;

    const cleanup = setupMessagesSubscription(conversationId);
    return () => cleanup();
  }, [conversationId]);

  const fetchAvailableMothers = async (id) => {
    const { data, error } = await supabase
      .from("Mother")
      .select("mother_name, mother_id")
      .eq("mother_id", id)
      .single();

    if (data) setAvailableMothers(data);
    if (error) console.error("Error fetching mother:", error);
  };

  const fetchConversation = async (userId, motherId) => {
    let { data: conversation, error } = await supabase
      .from("conversations")
      .select("conversation_id")
      .eq("bhw_id", userId)
      .eq("mother_id", motherId)
      .single();

    if (!conversation) {
      const { data: newConversation } = await supabase
        .from("conversations")
        .insert({
          bhw_id: userId,
          mother_id: motherId,
        })
        .select()
        .single();
      conversation = newConversation;
    }

    setConversationId(conversation.conversation_id);

    // Fetch the conversation's messages
    const { data: fetchedMessages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.conversation_id)
      .order("created_at", { ascending: true });

    setMessages(fetchedMessages || []);
  };

  const setupMessagesSubscription = (currentConversationId) => {
    const channel = supabase
      .channel(`conversation-${currentConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${currentConversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some((msg) => msg.id === payload.new.id);
            if (messageExists) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !availableMothers || !conversationId)
      return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert({
          sender_id: user,
          recipient_id: availableMothers.mother_id,
          content: newMessage,
          conversation_id: conversationId,
        })
        .select()
        .single();

      if (error) throw error;

      // No need to manually update messages array - the subscription will handle it
      setNewMessage("");

      // Update the last message timestamp in the conversation
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("conversation_id", conversationId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ height: "100vh", py: 2 }}>
      <Paper
        elevation={3}
        sx={{ height: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row">
            <IconButton onClick={() => router.push("/pages/Inbox")}>
              <ArrowBackIos />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h2">
                {availableMothers?.mother_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {availableMothers?.mother_id}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender_id === user ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  backgroundColor:
                    message.sender_id === user ? "primary.main" : "grey.100",
                  color: message.sender_id === user ? "white" : "text.primary",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Divider />
        <Box sx={{ p: 2, display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <Button variant="contained" endIcon={<Send />} onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatInterface;
