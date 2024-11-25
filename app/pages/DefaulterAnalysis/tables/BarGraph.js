import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Paper } from "@mui/material";

const chartSetting = {
  yAxis: [
    {
      label: "Vaccine Count",
    },
  ],
  height: 400,
};

const VaccineBarChart = ({ vaccineCounts }) => {
  console.log("vaccine", vaccineCounts);
  const data = Object.entries(vaccineCounts).map(([purok, vaccines]) => ({
    month: purok,
    ...vaccines,
  }));

  return (
    <Paper sx={{ padding: 4 }}>
      <BarChart
        dataset={data}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
            tickSize: 10,
            tickPadding: 5,
            tickRotation: -45, // Rotate ticks to fit more items
          },
        ]}
        series={[
          { dataKey: "MMR (Measles - Mumps - Rubella Vaccine)", label: "MMR" },
          { dataKey: "IPV (Inactive Polio Vaccine)", label: "IPV" },
          { dataKey: "PCV (Pneumococcal Conjugate Vaccine)", label: "PCV" },
          { dataKey: "OPV (Oral Polio Vaccine)", label: "OPV" },
          { dataKey: "Penta: DTwP-HepBHib", label: "Penta" },
          { dataKey: "BCG (Bacillus-Calmette-Guerin)", label: "BCG" },
          { dataKey: "Hepatitis B", label: "Hepatitis B" },
        ]}
        {...chartSetting}
      />
    </Paper>
  );
};

export default VaccineBarChart;
