import {
  Box,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
  TableBody,
} from "@mui/material";
import React from "react";

function createData(vaccine, defaulter) {
  return { vaccine, defaulter };
}

const rows = [
  createData("Dacoville", 159),
  createData("Dumoy", 237),
  createData("Farland", 262),
  createData("Pepsi", 305),
  createData("Farland", 356),
];

export default function VaccineLagTable() {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Vaccine</TableCell>
              <TableCell align="left">Defaulter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.vaccine}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.vaccine}
                </TableCell>
                <TableCell align="left">{row.defaulter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
