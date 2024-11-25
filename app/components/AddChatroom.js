import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { createClient } from "@/utils/supabase/client";

export default function AddChatroom({ open, onClose, onChatroomAdded }) {
  const [motherId, setMotherId] = useState("");
  const supabase = createClient();

  const handleAdd = async () => {
    const { data, error } = await supabase
      .from("chatrooms")
      .insert({ mother_id: motherId })
      .select()
      .single();

    if (error) {
      console.error("Error adding chatroom:", error);
      // You might want to show an error message to the user here
    } else {
      onChatroomAdded(data);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Chatroom</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="motherId"
          label="Mother ID"
          type="text"
          fullWidth
          variant="standard"
          value={motherId}
          onChange={(e) => setMotherId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
