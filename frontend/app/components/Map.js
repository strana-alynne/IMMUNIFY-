import { Box, Container, Typography } from "@mui/material";
export default function Map() {
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "100px",
        backgroundColor: "black",
      }}
    >
      <Container fixed sx={{ backgroundColor: "black" }}>
        <Typography variant="h1" color="primary">
          {" "}
          Map itu siya
        </Typography>
      </Container>
    </Box>
  );
}
