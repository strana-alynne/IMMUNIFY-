import React from "react";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography } from "@mui/material";
export default function Map() {
  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <Container fixed>
        <h1>Inbox</h1>
        <Typography variant="h1" color="primary">
          {" "}
          Map itu siya
        </Typography>
      </Container>
    </Box>
  );
}
