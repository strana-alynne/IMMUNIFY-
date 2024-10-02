import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const DefaultersTable = ({ clusters }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="cluster information table">
        <TableHead>
          <TableRow>
            <TableCell>Cluster</TableCell>
            <TableCell>Puroks (Defaulters)</TableCell>
            <TableCell>Total Defaulters</TableCell>
            <TableCell>Defaulted Vaccines</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clusters.map((cluster, index) => {
            // Get unique purok names and count defaulters per purok
            const purokCounts = cluster.points.reduce((acc, point) => {
              acc[point.purok_name] = (acc[point.purok_name] || 0) + 1;
              return acc;
            }, {});

            return (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    Cluster {index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.entries(purokCounts).map(([purok, count]) => (
                      <Chip
                        key={purok}
                        label={`${purok} (${count})`}
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{cluster.total_defaulters}</TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {Object.entries(cluster.defaulted_vaccines).map(
                      ([vaccine, count]) => (
                        <Chip
                          key={vaccine}
                          label={`${vaccine}: ${count}`}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      )
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DefaultersTable;
