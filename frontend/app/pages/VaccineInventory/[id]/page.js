"use client";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Typography,
  Stack,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  Button,
  Grid,
  TextField,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";

function createData(name, calories, fat) {
  return { name, calories, fat };
}

const rows = [
  createData("08/01/2024", 12, "BCG (Bacillus-Calmette-Guerin)"),
  createData("08/01/2024", 12, "MMR (Measles - Mumps - Rubella VAccine)"),
];

const Details = ({ params }) => {
  const handleButtonClick = (id) => {};
  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction={"column"}>
            <Stack direction="row" spacing={0.5}>
              <VaccinesIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h2" color="primary">
                Vaccine Inventory
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              vaccine name: {params.id}
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="date"
                label="Date"
                name="date"
                autoFocus
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="brand"
                label="Brand"
                name="brand"
                autoFocus
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                autoFocus
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleButtonClick(params.id)}
              >
                Add to Stock
              </Button>
            </Grid>
          </Grid>
          <Box>
            {" "}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date Restock</TableCell>
                    <TableCell>Quantity Added</TableCell>
                    <TableCell>Brand</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.calories}</TableCell>
                      <TableCell>{row.fat}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Details;
