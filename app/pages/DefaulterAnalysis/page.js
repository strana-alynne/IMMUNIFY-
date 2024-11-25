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
  const [topPuroksOverall, setTopPuroksOverall] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await fecthChildrenData();
      const dbData = await DBSCAN(data);
      console.log(dbData);
      setClusterData(dbData);

      if (dbData && dbData.clusters) {
        // Calculate overall purok counts across all clusters
        const overallPurokCounts = {};
        dbData.clusters.forEach((cluster) => {
          cluster.points.forEach((point) => {
            if (point.purok_name) {
              overallPurokCounts[point.purok_name] =
                (overallPurokCounts[point.purok_name] || 0) + 1;
            }
          });
        });

        // Get top 4 puroks overall for the cards
        const sortedOverallPuroks = Object.entries(overallPurokCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4);

        setTopPuroksOverall(sortedOverallPuroks);

        // Find cluster with highest number of defaulters
        const highestCluster = dbData.clusters.reduce((prev, current) =>
          prev.total_defaulters > current.total_defaulters ? prev : current
        );
        // Calculate purok counts for the highest cluster only
        const clusterPurokCounts = {};
        highestCluster.points.forEach((point) => {
          if (point.purok_name) {
            clusterPurokCounts[point.purok_name] =
              (clusterPurokCounts[point.purok_name] || 0) + 1;
          }
        });

        // Get top 3 puroks for this specific cluster
        const topClusterPuroks = Object.entries(clusterPurokCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        // Get the top defaulted vaccines from the highest cluster
        const defaultedVaccines = highestCluster.defaulted_vaccines;
        const sortedVaccines = Object.entries(defaultedVaccines).sort(
          ([, a], [, b]) => b - a
        );
        const topVaccine = sortedVaccines[0];

        const summaryText = `Analysis of  <strong> Cluster ${
          highestCluster.cluster + 1
        }</strong>, which has the highest concentration of defaulters with <strong>${
          highestCluster.total_defaulters
        }</strong> cases, 
          reveals significant patterns. This cluster, centered at latitude <strong>${highestCluster.center.latitude.toFixed(
            4
          )}</strong> and longitude <strong>${highestCluster.center.longitude.toFixed(
          4
        )}</strong>, 
          shows concentrated defaulter cases in three key areas: <strong>${topClusterPuroks
            .map((p) => `${p.name} (${p.count} cases)`)
            .join(", ")}</strong>. 
          Within this cluster, the <strong>${
            topVaccine[0]
          }</strong> has the highest number of defaulters with <strong>${
          topVaccine[1]
        }</strong> cases, 
          followed by <strong>${sortedVaccines[1][0]} (${
          sortedVaccines[1][1]
        } cases)</strong> and <strong>${sortedVaccines[2][0]} (${
          sortedVaccines[2][1]
        } cases)</strong>.`;

        setSummary(summaryText);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4} sx={{ pb: 4 }}>
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
                : topPuroksOverall.map((purok) => (
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

              {/* Cluster Summary Typography */}
              {loading ? (
                <Skeleton variant="text" width="100%" height={80} />
              ) : (
                <Typography
                  variant={isMobile || isTablet ? "12px" : "14px"}
                  color="text.primary"
                  sx={{ fontWeight: 400, fontStyle: "italic", mb: 3 }}
                  dangerouslySetInnerHTML={{ __html: summary }}
                />
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
