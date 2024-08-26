import React from "react";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography } from "@mui/material";

export default function ChildId() {
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Typography variant="h2">Dashboard</Typography>
      </Container>
    </Box>
  )
}
