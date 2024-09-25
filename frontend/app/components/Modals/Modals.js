import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function GeneralModals({
  open,
  onClose,
  title,
  content,
  actions,
  color,
  icon,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 350,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color={color}
          >
            <div>{icon}</div>
            {title}
          </Typography>
          <Typography color="black">{content}</Typography>
          <Box sx={{ mt: 2 }} color="info">
            {actions}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
