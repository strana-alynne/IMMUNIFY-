"use client";
import React, { useState, useEffect } from "react";
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
import { fetchVaccines } from "@/utils/supabase/api";

export default function VaccineInventory() {
  const [vaccines, setVaccines] = useState([]);
  const router = useRouter();
  useEffect(() => {
    async function loadVaccines() {
      const fetchedVaccines = await fetchVaccines();
      setVaccines(fetchedVaccines);
    }
    loadVaccines();
  }, []);

  const handleButtonClick = (id, name, inventoryid) => {
    localStorage.setItem("selectedVaccineName", name);
    localStorage.setItem("inventoryID", inventoryid);
    localStorage.setItem("vaccineID", id);
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
                    <TableCell>Doses Required</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Restock Date</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vaccines.map((row) => (
                    <TableRow
                      key={row.Vaccine.vaccine_name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.Vaccine.vaccine_id}
                      </TableCell>
                      <TableCell>{row.Vaccine.vaccine_name}</TableCell>
                      <TableCell>{row.Vaccine.doses_required}</TableCell>
                      <TableCell>{row.vaccine_quantity}</TableCell>
                      <TableCell>{row.current_update}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="text"
                          color="secondary"
                          onClick={() =>
                            handleButtonClick(
                              row.Vaccine.vaccine_id,
                              row.Vaccine.vaccine_name,
                              row.inventory_id
                            )
                          }
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
