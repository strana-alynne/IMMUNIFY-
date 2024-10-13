"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";
import DefaulterCard from "@/app/components/DefaulterCard";
import Map from "@/app/components/Map";
import DefaultersTable from "./tables/DefaultersTable";
import VaccineLagTable from "./tables/VaccineLagTable";
import { DBSCAN, fecthChildrenData } from "@/utils/supabase/dbscan";
import { useEffect, useState } from "react";
import VaccineBarChart from "./tables/BarGraph";

export default function DefaulterAnalysis() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [clusterData, setClusterData] = useState();
  const [topPuroks, setTopPuroks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await fecthChildrenData();
      const dbData = await DBSCAN(data);
      setClusterData(dbData);

      // Process top puroks when cluster data is available
      if (dbData && dbData.clusters) {
        const purokCounts = {};

        // Combine all points from all clusters
        dbData.clusters.forEach((cluster) => {
          cluster.points.forEach((point) => {
            if (point.purok_name) {
              purokCounts[point.purok_name] =
                (purokCounts[point.purok_name] || 0) + 1;
            }
          });
        });

        // Sort and get top 4 puroks
        const sortedPuroks = Object.entries(purokCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setTopPuroks(sortedPuroks);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4} sx={{ pb: 4 }}>
          {/* Title Section */}
          <Stack direction="row" spacing={0.5} alignContent="center">
            <Assessment sx={{ fontSize: { xs: 30, sm: 40 } }} color="primary" />
            <Typography variant={isMobile ? "h4" : "h2"} color="primary">
              Defaulter Analysis
            </Typography>
          </Stack>

          {/* Highest Number of Defaulters Section */}
          <Stack sx={{ pb: 2 }} spacing={0.5}>
            <Typography
              variant={isMobile || isTablet ? "h6" : "h5"}
              color="primary.darker"
              sx={{ fontWeight: 600 }}
            >
              Highest Number of Defaulters
            </Typography>
            <Grid container spacing={2} sx={{ width: "100%" }}>
              {loading
                ? Array.from(new Array(4)).map((_, index) => (
                    <Grid key={index} item xs={12} sm={6} md={3}>
                      <Skeleton variant="rounded" height={118} />
                    </Grid>
                  ))
                : topPuroks.map((purok) => (
                    <Grid key={purok.name} item xs={12} sm={6} md={3}>
                      <DefaulterCard
                        title={purok.name}
                        description={purok.count.toString()}
                      />
                    </Grid>
                  ))}
            </Grid>
          </Stack>

          {/* Grid for Defaulter Map and Vaccine Immunization */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* Defaulter Map */}
            <Grid item xs={12} sm={8}>
              <Stack spacing={2}>
                <Typography
                  variant={isMobile || isTablet ? "h6" : "h5"}
                  color="primary.darker"
                  sx={{ fontWeight: 600 }}
                >
                  Defaulter Map
                </Typography>
                {loading ? (
                  <Skeleton variant="rounded" height={400} />
                ) : (
                  <Map sx={{ width: "100%", height: "auto" }} />
                )}
              </Stack>
            </Grid>

            {/* Lagging Vaccine Immunization */}
            <Grid item xs={12} sm={4}>
              <Stack spacing={2}>
                <Typography
                  variant={isMobile || isTablet ? "h6" : "h5"}
                  color="primary.darker"
                  sx={{ fontWeight: 600 }}
                >
                  Lagging Vaccine Immunization
                </Typography>
                {loading ? (
                  <Skeleton variant="rounded" height={400} />
                ) : (
                  <VaccineLagTable
                    clusterData={clusterData}
                    sx={{ width: "100%" }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>

          {/* No. of Defaulters per Purok Section */}
          <Box>
            <Stack spacing={2}>
              <Typography
                variant={isMobile || isTablet ? "h6" : "h5"}
                color="primary.darker"
                sx={{ fontWeight: 600 }}
              >
                No. of Defaulters per Purok
              </Typography>
              {loading ? (
                <Skeleton variant="rounded" height={400} />
              ) : (
                <DefaultersTable clusters={clusterData.clusters} />
              )}
            </Stack>
          </Box>

          {/* Vaccine Bar Chart */}
          {loading ? (
            <Skeleton variant="rounded" height={400} />
          ) : (
            <VaccineBarChart
              vaccineCounts={clusterData.vaccine_counts_per_purok}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
