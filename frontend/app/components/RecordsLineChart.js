// components/ImmunizationChart.js
"use client";
import { LineChart } from "@mui/x-charts";
import {
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getImmunizationStats } from "@/utils/supabase/chart";
const COLORS = [
  "#2196f3", // primary
  "#9c27b0", // secondary
  "#f44336", // error
  "#4caf50",
  "#ff9800",
  "#795548",
];

const RecordsLineChart = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = useState({ chartData: [], vaccineNames: [] });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const stats = await getImmunizationStats();
      console.log("stats", stats);
      setData(stats);

      // Extract unique years from the data
      const years = [
        ...new Set(
          stats.chartData.map((item) => new Date(item.month).getFullYear())
        ),
      ].sort((a, b) => b - a); // Sort years in descending order

      setAvailableYears(years);
      console.log("years", years);
      // Set the most recent year as default
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Filter data based on selected year
    const filtered = data.chartData.filter(
      (item) => new Date(item.month).getFullYear() === selectedYear
    );
    setFilteredData(filtered);
  }, [selectedYear, data.chartData]);

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const xAxis = {
    data: filteredData.map((item) => item.month),
    scaleType: "time",
    valueFormatter: (date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    },
  };

  const series = data.vaccineNames.map((vaccine, index) => ({
    data: filteredData.map((item) => item[vaccine] || 0),
    label: vaccine,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        height: "100%",
        minHeight: 400,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant={isMobile ? "h6" : "h5"} color="primary">
          IMMUNIZATION TRENDS
        </Typography>

        <FormControl
          size="small"
          sx={{
            minWidth: 120,
            backgroundColor: "background.paper",
          }}
        >
          <Select value={selectedYear} onChange={handleYearChange} displayEmpty>
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Box
        sx={{
          width: "100%",
          height: 350,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {filteredData.length > 0 ? (
          <LineChart
            series={series}
            xAxis={[xAxis]}
            grid={{ horizontal: true }}
            margin={{
              left: 60,
              right: 20,
              top: 20,
              bottom: 40,
            }}
          />
        ) : (
          <Typography color="text.secondary">
            No data available for {selectedYear}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default RecordsLineChart;
