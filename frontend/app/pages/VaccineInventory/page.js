"use client";
import React from "react";
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
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { useRouter } from "next/navigation";

function createData(name, calories, fat, carbs, protein, date) {
  return { name, calories, fat, carbs, protein, date };
}

const rows = [
  createData(
    "0001",
    "BCG (Bacillus-Calmette-Guerin)",
    12,
    50,
    "24 hours",
    "08/01/2024"
  ),
  createData("0002", "Hepatitis B", 12, 50, "24 hours", "08/01/2024"),
  createData("0003", "Penta: DTwP-HepBHib", 12, 50, "24 hours", "08/01/2024"),
  createData("0004", "OPV", 12, 50, "24 hours", "08/01/2024"),
  createData(
    "0005",
    "MR (Measles - Rubella Vaccine)",
    12,
    50,
    "24 hours",
    "08/01/2024"
  ),
  createData(
    "0006",
    "MMR (Measles - Mumps - Rubella VAccine)",
    12,
    50,
    "24 hours",
    "08/01/2024"
  ),
];

export default function VaccineInventory() {
  const router = useRouter();
  const handleButtonClick = (id) => {
    router.replace(`/pages/VaccineInventory/${id}`);
  };
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <VaccinesIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Vaccine Inventory
            </Typography>
          </Stack>
          <Box>
            {" "}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Vaccine ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Administered Interval</TableCell>
                    <TableCell>Restock Date</TableCell>
                    <TableCell></TableCell>
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
                      <TableCell>{row.carbs}</TableCell>
                      <TableCell>{row.protein}</TableCell>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={() => handleButtonClick(row.name)}
                        >
                          View
                        </Button>
                      </TableCell>
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
}
