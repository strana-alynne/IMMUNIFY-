"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";
import DefaulterCard from "@/app/components/DefaulterCard";
import Map from "@/app/components/Map";
import DefaultersTable from "./tables/DefaultersTable";
import VaccineLagTable from "./tables/VaccineLagTable";
export default function DefaulterAnalysis() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <Assessment sx={{ fontSize: { xs: 30, sm: 40 } }} color="primary" />
            <Typography variant={isMobile ? "h4" : "h2"} color="primary">
              Defaulter Analysis
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={isMobile || isTablet ? "column" : "row"} spacing={2}>
          {/* GRAPHS AND NUMBERS */}
          <Box width={isMobile || isTablet ? "100%" : "80%"}>
            <Stack sx={{ display: "flex" }}>
              <Typography
                variant={isMobile || isTablet ? "h6" : "h5"}
                color="primary.darker"
              >
                HIGHEST NUMBER OF DEFAULTER
              </Typography>
              <Grid container spacing={2} sx={{ width: "100%" }}>
                <Grid item xs={12} sm={12} md={4}>
                  <DefaulterCard title="Dumoy" description="300" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <DefaulterCard title="Farland" description="200" />
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <DefaulterCard title="Dacoville" description="150" />
                </Grid>
              </Grid>
              <Stack>
                <Typography
                  variant={isMobile || isTablet ? "h6" : "h5"}
                  color="primary.darker"
                >
                  DEFAULTER ANALYSIS
                </Typography>
                <Map />
              </Stack>
            </Stack>
          </Box>
          {/* TABLES */}
          <Box width={isMobile || isTablet ? "100%" : "40%"}>
            <Stack spacing={4} display="flex">
              <Stack spacing={2}>
                <Typography
                  variant={isMobile || isTablet ? "h6" : "h5"}
                  color="primary.darker"
                >
                  No. of Defaulters per Purok
                </Typography>
                <DefaultersTable sx={{ minWidth: isMobile ? 300 : 650 }} />
              </Stack>
              <Stack spacing={2}>
                <Typography
                  variant={isMobile || isTablet ? "h6" : "h5"}
                  color="primary.darker"
                >
                  Lagging Vaccine Immunization
                </Typography>
                <Box>
                  <VaccineLagTable sx={{ minWidth: isMobile ? 300 : 650 }} />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
