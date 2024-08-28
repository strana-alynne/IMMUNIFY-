import { Box, Container, Typography } from "@mui/material";
export default function Map() {
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "100px",
      }}
    >
      <Container fixed sx={{ backgroundColor: "primary" }}>
        <h1>Inbox</h1>
        <Typography variant="h1" color="primary">
          {" "}
          Map itu siya
        </Typography>
      </Container>
    </Box>
  );
}
