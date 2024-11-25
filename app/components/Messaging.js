"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { supabase } from "../utils/supabase";

const Messaging = ({ user, receiverId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("receiver_id", receiverId);
      if (error) {
        console.error(error);
      } else {
        setMessages(data);
      }
    };
    fetchMessages();
  }, [receiverId]);

  const handleSendMessage = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ sender_id: user.id, receiver_id: receiverId, message }]);
      if (error) {
        console.error(error);
      } else {
        setMessage("");
        setMessages((prevMessages) => [...prevMessages, data[0]]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        label="Message"
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" onClick={handleSendMessage}>
        Send Message
      </Button>
      {messages.map((message) => (
        <div key={message.id}>
          <p>
            {message.sender_id === user.id ? "You" : "Mother"}:{" "}
            {message.message}
          </p>
        </div>
      ))}
    </Box>
  );
};

export default Messaging;
