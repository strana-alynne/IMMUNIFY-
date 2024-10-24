"use client";
"use client";
import { useState, useEffect } from "react";
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
  Skeleton,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { useRouter } from "next/navigation";
import { fetchVaccines } from "@/utils/supabase/api";
import VaccineAlert from "@/app/components/VaccineAlert";

const VACCINE_COVERAGE = {
  "BCG (Bacillus-Calmette-Guerin)": 10,
  "Hepatitis B": 10,
  "Penta: DTwP-HepBHib": 1,
  "PCV (Pneumococcal Conjugate Vaccine)": 4,
  "OPV (Oral Polio Vaccine)": 20,
  "IPV (Inactive Polio Vaccine)": 10,
  "MMR (Measles - Mumps - Rubella Vaccine)": 10,
};

export default function VaccineInventory() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    async function loadVaccines() {
      const fetchedVaccines = await fetchVaccines();
      const vaccinesWithCoverage = fetchedVaccines.map((vaccine) => ({
        ...vaccine,
        babiesCovered: calculateBabiesCovered(
          vaccine.Vaccine.vaccine_name,
          vaccine.vaccine_quantity
        ),
      }));
      setVaccines(vaccinesWithCoverage);
      setLoading(false); // Stop loading when data is ready
    }
    loadVaccines();
  }, []);

  const calculateBabiesCovered = (vaccineName, quantity) => {
    const coverage = VACCINE_COVERAGE[vaccineName];
    return coverage ? quantity * coverage : 0;
  };

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
        <TableCell>Total Vials</TableCell>
        <TableCell>Babies Covered</TableCell>
        {!isMobile && <TableCell>Restock Date</TableCell>}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );

  const renderTableBody = () => {
    if (loading) {
      // Render skeletons while loading
      return (
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: isMobile ? 4 : 5 }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton variant="text" width="100%" height={30} />
                </TableCell>
              ))}
              <TableCell>
                <Skeleton variant="rectangular" width={80} height={36} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    // Render actual data if not loading
    return (
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
            <TableCell>{row.babiesCovered}</TableCell>
            {!isMobile && <TableCell>{row.current_update}</TableCell>}
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
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
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
