"use client";
import React from "react";
import SideBar from "@/app/components/SideBar/page";
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
  IconButton,
  Chip,
  Grid,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  ListItemText,
  Checkbox,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FaceIcon from "@mui/icons-material/Face";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from "next/navigation";
//responsible for getting the data from the array
function createData(name, age, bday, purok, mother, status) {
  return { name, age, bday, purok, mother, status };
}
//Chip Color
const getChipColor = (status) => {
  switch (status) {
    case "Completed":
      return {
        backgroundColor: "primary.light",
        color: "primary.dark",
        fontWeight: "bold",
      }; // You can use hex codes or predefined MUI colors here
    case "Partial":
      return {
        backgroundColor: "secondary.light",
        color: "secondary.dark",
        fontWeight: "bold",
      };
    case "Missed Schedule":
      return {
        backgroundColor: "error.light",
        color: "error.dark",
        fontWeight: "bold",
      };
    default:
      return "default"; // fallback color
  }
};

// Data Table
const rows = [
  createData(
    "Sarah Johnsons",
    "12 months",
    "12/24/2023",
    "farland",
    "Maria Johnsons",
    "Completed"
  ),
  createData(
    "Sarah Johnsons",
    "12 months",
    "12/24/2023",
    "farland",
    "Maria Johnsons",
    "Partial"
  ),
  createData(
    "Sarah Johnsons",
    "12 months",
    "12/24/2023",
    "farland",
    "Maria Johnsons",
    "Missed Schedule"
  ),
];

// purok filter
const purok = [
  "Farland 1",
  "Farland 2",
  "Farlandville",
  "Country Homes",
  "New Creation",
  "DLF",
  "Macleod",
  "Rasay",
  "Sison",
  "Back of Pepsi",
  "Greenland",
  "Maharlika",
  "Pag-ibig",
  "Philbanking",
  "Dusnai",
  "Sto. Rosario",
  "Paderog",
  "Mangrubang",
];

//status filter
const statusArr = [
 "Completed",
 "Partial",
 "Missed Schedule",
];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ChildRecords() {
  const router = useRouter();
  const [purokName, setPurokName] = React.useState([]);
  const [statusName, setStatusName] = React.useState([]);

  const handleRowClick = (name) => {
    router.push(`/ChildRecords/${name}`);
  };

  const handlePurokChange = (event) => {
    const {
      target: { value },
    } = event;
    setPurokName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handleStatusChange = (event) => {
    const {
      target: { value },
    } = event;
    setStatusName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <FaceIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Child Records
            </Typography>
          </Stack>
          <Grid container alignItems="center" spacing={2}>
            {/* SEARCH TEXTFIELD */}
            <Grid item xs={4}>
              <TextField
                fullWidth
                id="outlined-size-small"
                label="Search..."
                name="seacrh"
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            {/* DROPDOWN BY PUROK */}
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">
                  Filter by Purok
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={purokName}
                  onChange={handlePurokChange}
                  input={<OutlinedInput label="Filter by Purok" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {purok.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={purokName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* DROPDOWN BY STATUS */}
            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-checkbox-label">
                  Filter by Purok
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={statusName}
                  onChange={handleStatusChange}
                  input={<OutlinedInput label="Filter by Purok" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {statusArr.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={statusName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              <Button variant="contained" color="primary">
                Add Child
              </Button>
            </Grid>
          </Grid>

          {/* THIS IS THE TABLE */}
          <Box>
            {" "}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>BirthDate</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Purok</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Mother's Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 }, cursor: "pointer" }}
                      onClick={() => handleRowClick(row.name)}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell>{row.age}</TableCell>
                      <TableCell>{row.bday}</TableCell>
                      <TableCell>{row.purok}</TableCell>
                      <TableCell>{row.mother}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          sx={getChipColor(row.status)}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <IconButton aria-label="delete" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
