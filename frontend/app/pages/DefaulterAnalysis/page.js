"use client";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import DefaulterCard from "@/app/components/DefaulterCard";
import Map from "@/app/components/map";
import DefaultersTable from "./tables/DefaultersTable";
import VaccineLagTable from "./tables/VaccineLagTable";
export default function DefaulterAnalysis() {
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <Assessment sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Defaulter Analysis
            </Typography>
          </Stack>
        </Stack>
        <Stack container direction="row">
          {/* GRAPHS AND NUMBERS */}
          <Stack>
            <Typography variant="h5" color="primary.darker">
              HIGHEST NUMBER OF DEFAULTER
            </Typography>
            <Grid container direction="row" columnSpacing={2}>
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
            <Typography variant="h5" color="primary.darker">
              DEFAULTER ANALYSIS
            </Typography>
            <Grid container direction="row" columnSpacing={2}>
              <Map />
            </Grid>
          </Stack>
          {/* TABLES */}
          <Stack>
            <Typography variant="h5" color="primary.darker">
              No. of Defaulters per Purok
            </Typography>
            <DefaultersTable />
            <Typography variant="h5" color="primary.darker">
              Lagging Vaccine Immunization
            </Typography>
            <VaccineLagTable />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
