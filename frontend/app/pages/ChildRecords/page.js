"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Button,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchAllChildren } from "@/utils/supabase/api";
import { AddCircle, Face, Face2 } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import SideBar from "@/app/components/SideBar/page";
import VaccineAlert from "@/app/components/VaccineAlert";
//Chip Color
const getChipColor = (status) => {
  switch (status) {
    case "Complete":
      return {
        backgroundColor: "primary.light",
        color: "primary.dark",
        fontWeight: "bold",
      }; // You can use hex codes or predefined MUI colors here
    case "Partially Complete":
      return {
        backgroundColor: "secondary.light",
        color: "secondary.dark",
        fontWeight: "bold",
      };
    case "Missed":
      return {
        backgroundColor: "error.light",
        color: "error.dark",
        fontWeight: "bold",
      };
    default:
      return "default"; // fallback color
  }
};

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
  "Dumoy Proper",
  "Iwha",
  "Pepsi Village",
  "Medalla",
  "Leonor",
  "Dacoville 1",
  "Dacoville 2",
  "Don Lorenzo",
  "Espino Kalayaan",
];

//status filter
const statusArr = ["Completed", "Partial", "Missed"];
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
  const [purokName, setPurokName] = useState([]);
  const [statusName, setStatusName] = useState([]);
  const [child, setChild] = useState([]);
  const [pageSize, setPageSize] = useState(5); // Page size for pagination
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    router.replace(`/pages/ChildRecords/AddChild`);
  };

  useEffect(() => {
    async function loadChild() {
      try {
        const fetchedChildren = await fetchAllChildren();
        setChild(fetchedChildren);

        // Filter based on search term and selected purok
        const filteredChildren = fetchedChildren.filter((child) => {
          const matchesSearchTerm =
            child.child_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.Purok?.purok_name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            child.Mother?.mother_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          // Filter by Purok if any are selected
          const matchesPurok =
            purokName.length === 0 ||
            purokName.includes(child.Purok?.purok_name);

          // Filter by Status if any are selected
          const matchesStatus =
            statusName.length === 0 || statusName.includes(child.overallStatus);

          return matchesSearchTerm && matchesPurok && matchesStatus;
        });

        setChild(filteredChildren);
      } catch (error) {
        console.error("Error fetching children:", error);
      }
    }
    loadChild();
  }, [searchTerm, purokName, statusName]);

  const handleRowClick = (params) => {
    localStorage.setItem("childStatus", params.row.overallStatus);
    // Navigate to details page with row ID
    router.push(`/pages/ChildRecords/${params.id}`);
  };

  // Define the columns for DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      renderCell: (params) => (
        <>
          {params.row.gender === "Female" ? (
            <Face2 color="secondary" style={{ marginRight: "8px" }} />
          ) : (
            <Face color="primary" style={{ marginRight: "8px" }} />
          )}
          {params.row.child_name}
        </>
      ),
    },
    {
      field: "age",
      headerName: "Age",
      width: 100,
      renderCell: (params) => <>{params.row.child_age} months</>,
    },
    {
      field: "bday",
      headerName: "Birth Date",
      width: 150,
      renderCell: (params) => <>{params.row.birthdate}</>,
    },
    {
      field: "purok",
      headerName: "Purok",
      width: 150,
      renderCell: (params) => (
        <>
          {params.row.Purok?.purok_name || "N/A"}{" "}
          {/* Fallback to "N/A" if undefined */}
        </>
      ),
    },
    {
      field: "mother",
      headerName: "Mother's Name",
      width: 250,
      renderCell: (params) => <>{params.row.Mother.mother_name}</>,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.overallStatus}
          sx={getChipColor(params.row.overallStatus)}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="h2" color="primary">
              Child Records
            </Typography>
          </Stack>
          <VaccineAlert />
          <Grid container alignItems="start" spacing={2}>
            {/* SEARCH TEXTFIELD */}
            <Grid item xs={4}>
              <TextField
                size="medium"
                fullWidth
                label="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <InputLabel>Filter by Purok</InputLabel>
                <Select
                  multiple
                  value={purokName}
                  onChange={(e) => setPurokName(e.target.value)}
                  input={<OutlinedInput label="Filter by Purok" />}
                  renderValue={(selected) => selected.join(", ")}
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
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  multiple
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                  input={<OutlinedInput label="Filter by Status" />}
                  renderValue={(selected) => selected.join(", ")}
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

            {/* ADD BUTTON */}
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircle />}
                onClick={handleAdd}
              >
                Add Child
              </Button>
            </Grid>
          </Grid>

          {/* DATA GRID TABLE */}
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={child}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 25]}
              pagination
              page={page}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              getRowId={(row) => row.child_id} // Ensure each row has a unique id
              disableSelectionOnClick
              onRowClick={handleRowClick}
              sx={{
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer", // Change cursor on row hover
                  backgroundColor: "#f5f5f5", // Optional: Add hover background effect
                },
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
