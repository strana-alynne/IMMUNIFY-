import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const VACCINE_COVERAGE = {
  "BCG (Bacillus-Calmette-Guerin)": 10,
  "Hepatitis B": 10,
  "Penta: DTwP-HepBHib": 1,
  "PCV (Pneumococcal Conjugate Vaccine)": 4,
  "OPV (Oral Polio Vaccine)": 20,
  "IPV (Inactive Polio Vaccine)": 10,
  "MMR (Measles - Mumps - Rubella Vaccine)": 10,
};

const VaccineLagTable = ({ clusterData }) => {
  // More detailed checking
  if (!clusterData) {
    return <Typography>No cluster data available</Typography>;
  }

  if (!clusterData.clusters) {
    return <Typography>No clusters available in data</Typography>;
  }

  if (!Array.isArray(clusterData.clusters)) {
    return <Typography>Invalid clusters data format</Typography>;
  }

  // Process data for the table
  const vaccineData = {};
  clusterData.clusters.forEach((cluster, index) => {
    if (!cluster.defaulted_vaccines) {
      console.log(
        `Cluster at index ${index} has no defaulted_vaccines:`,
        cluster
      );
      return; // Skip this iteration
    }

    Object.entries(cluster.defaulted_vaccines).forEach(([vaccine, count]) => {
      if (!vaccineData[vaccine]) {
        vaccineData[vaccine] = {
          totalMissed: 0,
          locations: [],
        };
      }
      vaccineData[vaccine].totalMissed += count;
      if (
        cluster.center &&
        typeof cluster.center.latitude === "number" &&
        typeof cluster.center.longitude === "number"
      ) {
        vaccineData[vaccine].locations.push({
          lat: cluster.center.latitude,
          lon: cluster.center.longitude,
          count: count,
        });
      } else {
        console.log(
          `Invalid center coordinates for cluster at index ${index}:`,
          cluster.center
        );
      }
    });
  });

  // Check if we have any processed data
  const sortedVaccines = Object.entries(vaccineData);
  if (sortedVaccines.length === 0) {
    return <Typography>No vaccine data available to display</Typography>;
  }

  // Sort vaccines by total missed count
  sortedVaccines.sort(([, a], [, b]) => b.totalMissed - a.totalMissed);

  const calculateBabiesCovered = (vaccineName, quantity) => {
    const coverage = VACCINE_COVERAGE[vaccineName];
    return coverage ? quantity / coverage : 0;
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="vaccine defaulter table">
        <TableHead>
          <TableRow>
            <TableCell>Vaccine</TableCell>
            <TableCell align="left">Total Missed</TableCell>
            <TableCell align="left">Equivalent Vaccine Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedVaccines.map(([vaccine, data]) => (
            <TableRow key={vaccine}>
              <TableCell component="th" scope="row">
                {vaccine}
              </TableCell>
              <TableCell align="left">{data.totalMissed}</TableCell>
              <TableCell align="left">
                {calculateBabiesCovered(vaccine, data.totalMissed)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VaccineLagTable;
