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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { useRouter } from "next/navigation";
import { fetchVaccines } from "@/utils/supabase/api";
import VaccineAlert from "@/app/components/VaccineAlert";

export default function VaccineInventory() {
  const [vaccines, setVaccines] = useState([]);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const renderTableHeader = () => (
    <TableHead>
      <TableRow>
        <TableCell>Vaccine ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Total</TableCell>
        {!isMobile && (
          <>
            <TableCell>Doses Required</TableCell>
            <TableCell>Restock Date</TableCell>
          </>
        )}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => (
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
          <TableCell>{row.vaccine_quantity}</TableCell>
          {!isMobile && (
            <>
              <TableCell>{row.Vaccine.doses_required}</TableCell>
              <TableCell>{row.current_update}</TableCell>
            </>
          )}
          <TableCell>
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
              {isMobile ? "Details" : "View"}
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <VaccinesIcon
              sx={{ fontSize: { xs: 30, sm: 40 } }}
              color="primary"
            />
            <Typography variant={isMobile ? "h4" : "h2"} color="primary">
              Vaccine Inventory
            </Typography>
          </Stack>
          <VaccineAlert />
          <Box sx={{ overflowX: "auto" }}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: isMobile ? 300 : 650 }}
                aria-label="vaccine inventory table"
              >
                {renderTableHeader()}
                {renderTableBody()}
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
