import React from "react";
import {
  Box,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
  TableBody,
  useTheme,
  useMediaQuery,
} from "@mui/material";

function createData(purok, immunized, defaulter) {
  return { purok, immunized, defaulter };
}

const rows = [
  createData("Dacoville", 159, 6),
  createData("Dumoy", 237, 9),
  createData("Farland", 262, 16),
  createData("Pepsi", 305, 3),
  createData("Farland", 356, 16),
];

export default function DefaultersTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ overflowX: "auto" }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: isMobile ? 300 : 650 }}
          size="small"
          aria-label="defaulters table"
        >
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
