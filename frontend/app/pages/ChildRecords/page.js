"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Chip,
  Button,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  useMediaQuery,
  useTheme,
  Skeleton,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchAllChildren,
  fetchImmunizedChild,
  fetchImmunizedChildId,
  fetchScheduledChild,
  fetchScheduledChildId,
  fetchScheduledChildTom,
  fetchSchedTomChildId,
  deleteChild,
} from "@/utils/supabase/api";
import {
  AddCircle,
  CalendarMonth,
  Delete,
  EventBusy,
  Face,
  Face2,
  Warning,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import VaccineAlert from "@/app/components/VaccineAlert";
import ChildRecordCard from "@/app/components/ChildRecordCard";
import GeneralModals from "@/app/components/Modals/Modals";
import { toast, Toaster } from "sonner";

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
const statusArr = ["Complete", "Partially Complete", "Missed"];
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
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [purokName, setPurokName] = useState([]);
  const [statusName, setStatusName] = useState([]);
  const [child, setChild] = useState([]);
  const [pageSize, setPageSize] = useState(5); // Page size for pagination
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [scheduledToday, SetScheduledToday] = useState();
  const [childToday, setChildToday] = useState();
  const [scheduledTomorrow, setScheduledTomorrow] = useState();
  const today = new Date();
  const [activeFilter, setActiveFilter] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const formattedToday = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleAdd = () => {
    router.replace(`/pages/ChildRecords/AddChild`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search Handler with Type Safety
  const handleSearch = useCallback((searchValue) => {
    setSearchTerm(searchValue);
    setPage(0); // Reset to first page when search changes
  }, []);

  // Modified handle delete to open modal first
  const handleDeleteClick = (childId, childName) => {
    setChildToDelete({ id: childId, name: childName });
    setDeleteModalOpen(true);
  };

  // Actual delete function
  const handleConfirmDelete = async () => {
    if (!childToDelete) return;

    setDeleteInProgress(true);
    try {
      await deleteChild(childToDelete.id);

      // Show success toast
      toast.success("Record Deleted Successfully", {
        description: `${childToDelete.name}'s record has been deleted.`,
        duration: 3000,
      });

      // Refresh the data after deletion
      const fetchedChildren = await fetchAllChildren();
      setChild(fetchedChildren);
    } catch (error) {
      console.error("Error deleting child:", error);
      // Show error toast
      toast.error("Delete Failed", {
        description:
          "There was an error deleting the record. Please try again.",
        duration: 3000,
      });
    } finally {
      setDeleteInProgress(false);
      setDeleteModalOpen(false);
      setChildToDelete(null);
    }
  };

  useEffect(() => {
    async function loadChild() {
      try {
        setLoading(true);
        const fetchedChildren = await fetchAllChildren();

        // Fetch all necessary data
        const scheduledIdsObjects = await fetchScheduledChildId();
        const scheduledIds = scheduledIdsObjects.map((obj) => obj.child_id);
        const totalScheduledToday = await fetchScheduledChild();
        const totalChildToday = await fetchImmunizedChild();
        const vaccinatedIsObj = await fetchImmunizedChildId();
        const vaccinatedId = vaccinatedIsObj.map((obj) => obj.child_id);
        const totalScheduledTomorrow = await fetchScheduledChildTom();
        const schedTomisObj = await fetchSchedTomChildId();
        const schedTomId = schedTomisObj.map((obj) => obj.child_id);

        // Update states
        SetScheduledToday(totalScheduledToday);
        setChildToday(totalChildToday);
        setScheduledTomorrow(totalScheduledTomorrow);

        // Apply filters
        let filteredChildren = fetchedChildren;

        // Active filter logic
        if (activeFilter === "scheduled") {
          filteredChildren = fetchedChildren.filter((child) =>
            scheduledIds.includes(child.child_id)
          );
        } else if (activeFilter === "vaccinated") {
          filteredChildren = fetchedChildren.filter((child) =>
            vaccinatedId.includes(child.child_id)
          );
        } else if (activeFilter === "schedTomorrow") {
          filteredChildren = fetchedChildren.filter((child) =>
            schedTomId.includes(child.child_id)
          );
        }

        // Search and filter logic
        filteredChildren = filteredChildren.filter((child) => {
          const matchesSearchTerm = debouncedSearchTerm
            ? child.child_name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              child.Purok?.purok_name
                ?.toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              child.Mother?.mother_name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
            : true;

          const matchesPurok =
            purokName.length === 0 ||
            purokName.includes(child.Purok?.purok_name);

          const matchesStatus =
            statusName.length === 0 || statusName.includes(child.overallStatus);

          return matchesSearchTerm && matchesPurok && matchesStatus;
        });

        setChild(filteredChildren);
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    }

    loadChild();
  }, [debouncedSearchTerm, purokName, statusName, activeFilter]);
  const handleRowClick = (params) => {
    localStorage.setItem("childStatus", params.row.overallStatus);
    router.push(`/pages/ChildRecords/${params.id}`);
  };

  const handleScheduledCardClick = () => {
    // Toggle the filter
    setActiveFilter(activeFilter === "scheduled" ? null : "scheduled");
    // Reset to first page when filter changes
    setPage(0);
  };

  const handleScheduledCardClickVac = () => {
    // Toggle the filter
    setActiveFilter(activeFilter === "vaccinated" ? null : "vaccinated");
    // Reset to first page when filter changes
    setPage(0);
  };
  const handleScheduledCardClickTom = () => {
    // Toggle the filter
    setActiveFilter(activeFilter === "schedTomorrow" ? null : "schedTomorrow");
    // Reset to first page when filter changes
    setPage(0);
  };

  // Define the columns for DataGrid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
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
      hide: isMobile,
      renderCell: (params) => <>{params.row.birthdate}</>,
    },
    {
      field: "purok",
      headerName: "Purok",
      width: 150,
      hide: isMobile,
      renderCell: (params) => <>{params.row.Purok?.purok_name || "N/A"}</>,
    },
    {
      field: "mother",
      headerName: "Mother's Name",
      width: 200,
      hide: isMobile || isTablet,
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
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div onClick={(event) => event.stopPropagation()}>
          <IconButton
            onClick={() => handleDeleteClick(params.id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Toaster richColors position="top-right" />
        <Stack spacing={4}>
          <VaccineAlert />
          <Paper elevation={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={4}>
                <ChildRecordCard
                  header="Scheduled Today"
                  title={scheduledToday}
                  description={formattedToday}
                  color="primary.main"
                  loading={loading}
                  onClick={handleScheduledCardClick}
                  isActive={activeFilter === "scheduled"}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <ChildRecordCard
                  header="Vaccinated Today"
                  title={childToday}
                  color="secondary"
                  description={formattedToday}
                  loading={loading}
                  onClick={handleScheduledCardClickVac}
                  isActive={activeFilter === "vaccinated"}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4}>
                <ChildRecordCard
                  header="Scheduled Tomorrow"
                  title={scheduledTomorrow}
                  description={formattedTomorrow}
                  color="error.dark"
                  loading={loading}
                  onClick={handleScheduledCardClickTom}
                  isActive={activeFilter === "schedTomorrow"}
                />
              </Grid>
            </Grid>
          </Paper>

          {activeFilter === "scheduled" && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "primary.light",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonth color="primary" />
                <Typography color="primary.main">
                  Showing {scheduledToday} scheduled children for today
                </Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setActiveFilter(null)}
                startIcon={<EventBusy />}
              >
                Clear Filter
              </Button>
            </Paper>
          )}
          {activeFilter === "vaccinated" && (
            <Paper
              sx={{
                p: 2,
                bgcolor: "primary.light",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonth color="primary" />
                <Typography color="primary.main">
                  Showing {childToday} Vaccinated children for today
                </Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setActiveFilter(null)}
                startIcon={<EventBusy />}
              >
                Clear Filter
              </Button>
            </Paper>
          )}
          {/* TextFields */}
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircle />}
                onClick={handleAdd}
                size={isMobile ? "small" : "medium"}
              >
                Add Child
              </Button>
            </Box>
            <Paper elevation={0}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Search..."
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Purok</InputLabel>
                    <Select
                      multiple
                      value={purokName}
                      onChange={(e) => setPurokName(e.target.value)}
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
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                      multiple
                      value={statusName}
                      onChange={(e) => setStatusName(e.target.value)}
                      input={<OutlinedInput label="Filter by Status" />}
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
              </Grid>
            </Paper>
            {/* CHILD TABLE */}
            <Box sx={{ height: 500, width: "100%" }}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={500}
                  animation="wave"
                />
              ) : (
                <DataGrid
                  rows={child}
                  columns={columns}
                  pageSize={pageSize}
                  rowsPerPageOptions={[5, 10, 25]}
                  pagination
                  page={page}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  getRowId={(row) => row.child_id}
                  disableSelectionOnClick
                  onRowClick={handleRowClick}
                  sx={{
                    "& .MuiDataGrid-row:hover": {
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                    },
                    "& .MuiDataGrid-cell": {
                      wordBreak: "break-word",
                    },
                  }}
                />
              )}
            </Box>
          </Stack>
        </Stack>
        <GeneralModals
          open={deleteModalOpen}
          onClose={() => {
            if (!deleteInProgress) {
              setDeleteModalOpen(false);
              setChildToDelete(null);
            }
          }}
          title="Delete Confirmation"
          content={`Are you sure you want to delete ${childToDelete?.name}'s record? This action cannot be undone.`}
          color="error"
          icon={<Warning sx={{ fontSize: 40, color: "error.main", mb: 1 }} />}
          actions={
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setChildToDelete(null);
                }}
                disabled={deleteInProgress}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                disabled={deleteInProgress}
              >
                {deleteInProgress ? "Deleting..." : "Delete"}
              </Button>
            </Box>
          }
        />
      </Container>
    </Box>
  );
}
