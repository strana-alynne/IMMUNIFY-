import React from "react";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography } from "@mui/material";

const ChildId = ({params}) => {
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Typography variant="h2">{params.id}</Typography>
      </Container>
    </Box>
  )
}

export default ChildId;
