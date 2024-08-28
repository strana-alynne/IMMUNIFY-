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

function createData(purok, immunized, defaulter) {
  return { purok, immunized, defaulter };
}

const rows = [
  createData("Dacoville", 159, 6.0),
  createData("Dumoy", 237, 9.0),
  createData("Farland", 262, 16.0),
  createData("Pepsi", 305, 3),
  createData("Farland", 356, 16.0),
];

export default function DefaultersTable() {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Purok</TableCell>
              <TableCell>Immunized</TableCell>
              <TableCell>Defaulter</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.purok}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.purok}
                </TableCell>
                <TableCell>{row.immunized}</TableCell>
                <TableCell>{row.defaulter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
