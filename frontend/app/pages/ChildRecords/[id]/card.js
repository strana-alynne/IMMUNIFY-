import React from 'react'
import {
    TableContainer,
    TableCell,
    TableHead,
    TableRow,
    Table,
    TableBody,
    Paper,
  } from "@mui/material";
 
  function createData(vaccineName) {
    return { vaccineName };
  }
  const rows = [
    createData("BCG (Bacillus-Calmette-Guerin)"),
    createData("Hepatitis B"),
    createData("Penta: DTwP-HepBHib"),
    createData("PCV (Pnuemococcal Conjugate Vaccine)"),
    createData("OPV"),
    createData("IPV (Inactive Polio Vaccine)"),
    createData("MR (Measles - Rubella Vaccine)"),
    createData("MMR (Measles - Mumps - Rubella VAccine)"),
  ];
export default function ChildCard() {
  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: "bold" }}>Vaccine</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>24hr</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>6 Weeks</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>10 Weeks</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>14 Weeks</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>9 months</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>9 months</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>10 - 15 months</TableCell>
          <TableCell align="left" sx={{ fontWeight: "bold" }}>16 months amd above</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.vaccineName}
          >
            <TableCell sx={{backgroundColor: 'primary.light'}}>{row.vaccineName}</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
           
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}
