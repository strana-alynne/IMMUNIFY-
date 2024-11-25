"use client";
import { useState, useEffect, useRef } from "react";
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
import AppBarMobile from "@/app/components/AppBarMobile";
import MobileSideBar from "@/app/components/MobileSideBar";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const supabase = createClient();
  const router = useRouter();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mother_id = localStorage.getItem("motherId");

  const initChat = async () => {
    setUser(mother_id);

    // Step 1: Fetch or create conversation
    let convId = await fetchConversation("BHW", mother_id);

    if (!convId) {
      const newConv = await createNewConversation("BHW", mother_id);
      convId = newConv?.conversation_id;
    }

    if (convId) {
      setConversationId(convId);

      // Step 2: Fetch existing messages
      await loadExistingMessages(convId);

      // Step 3: Setup Realtime subscription after messages are loaded
      setupMessagesSubscription(convId);
    }

    setIsLoading(false);
  };

  // New function to load existing messages
  const loadExistingMessages = async (convId) => {
    const { data: fetchedMessages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching existing messages:", error.message);
      return;
    }

    setMessages(fetchedMessages || []);
  };

  useEffect(() => {
    initChat();

    return () => {
      // Cleanup subscription on component unmount
      if (conversationId) {
        const channel = supabase.channel(`realtime:messages:${conversationId}`);
        supabase.removeChannel(channel);
      }
    };
  }, [mother_id]);

  const createNewConversation = async (userId, motherId) => {
    const { data: newConversation, error: insertError } = await supabase
      .from("conversations")
      .insert({ bhw_id: userId, mother_id: motherId })
      .select()
      .single();

    if (insertError) throw insertError;
    return newConversation;
  };
  const fetchConversation = async (userId, motherId) => {
    try {
      let { data: conversation, error } = await supabase
        .from("conversations")
        .select("conversation_id")
        .eq("bhw_id", userId)
        .eq("mother_id", motherId)
        .single(); // Fetch only one conversation

      if (error && error.code !== "PGRST116") {
        // Ignore "No rows found" error
        throw error;
      }

      // Return conversation_id if found
      return conversation ? conversation.conversation_id : null;
    } catch (error) {
      console.error("Error fetching conversation:", error.message);
      return null;
    }
  };
  const setupMessagesSubscription = (convId) => {
    const channel = supabase
      .channel(`realtime:messages:${convId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          console.log("Real-time event received:", payload);

          if (payload.eventType === "INSERT") {
            // Only add the message if it's not already in the messages array
            setMessages((prev) => {
              const messageExists = prev.some(
                (msg) => msg.id === payload.new.id
              );
              if (!messageExists) {
                return [...prev, payload.new];
              }
              return prev;
            });
            scrollToBottom();
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return channel;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversationId) return;

    try {
      const messageToSend = {
        sender_id: mother_id,
        recipient_id: "BHW",
        content: newMessage,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
      };

      // Clear input field immediately for better UX
      setNewMessage("");

      const { error } = await supabase
        .from("messages")
        .insert(messageToSend)
        .select()
        .single();

      if (error) throw error;

      // Update conversation last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("conversation_id", conversationId);
    } catch (error) {
      console.error("Error sending message:", error.message);
      // Optionally show an error message to the user
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
      <AppBarMobile toggleDrawer={toggleDrawer} />
      <MobileSideBar open={open} toggleDrawer={toggleDrawer} />
      <Paper
        elevation={0}
        sx={{ height: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Stack direction="row">
            <IconButton
              onClick={() => router.replace("/pages/mobilePages/MobileInbox")}
            >
              <ArrowBackIos />
            </IconButton>
            <Box>
              <Typography variant="h5" component="h2">
                Brgy. Health Worker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                How we may help you?
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
