"use client";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import DefaulterCard from "@/app/components/DefaulterCard";
import Map from "@/app/components/Map";
import DefaultersTable from "./tables/DefaultersTable";
import VaccineLagTable from "./tables/VaccineLagTable";
export default function DefaulterAnalysis() {
  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <Assessment sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Defaulter Analysis
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          {/* GRAPHS AND NUMBERS */}
          <Box sx={{ width: "60%" }}>
            <Stack>
              <Typography variant="h5" color="primary.darker">
                HIGHEST NUMBER OF DEFAULTER
              </Typography>
              <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid item xs={4}>
                  <DefaulterCard title="Dumoy" description="300" />
                </Grid>
                <Grid item xs={4}>
                  <DefaulterCard title="Farland" description="200" />
                </Grid>
                <Grid item xs={4}>
                  <DefaulterCard title="Dacoville" description="150" />
                </Grid>
              </Grid>
              <Stack>
                <Typography variant="h5" color="primary.darker">
                  DEFAULTER ANALYSIS
                </Typography>
                <Map />
              </Stack>
            </Stack>
          </Box>
          {/* TABLES */}
          <Box sx={{ width: "40%", maxWidth: "400px" }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h5" color="primary.darker">
                  No. of Defaulters per Purok
                </Typography>
                <DefaultersTable />
              </Stack>
              <Stack spacing={2}>
                <Typography variant="h5" color="primary.darker">
                  Lagging Vaccine Immunization
                </Typography>
                <Box>
                  <VaccineLagTable />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
