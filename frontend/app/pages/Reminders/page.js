"use client";

import { useEffect, useState } from "react"; // Import the notification hook
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReminderCard from "@/app/components/ReminderCard";
import {
  Notifications,
  NewReleases,
  Campaign,
  Send,
  Delete,
} from "@mui/icons-material";
import {
  addReminder,
  fetchReminders,
  deleteReminder,
} from "@/utils/supabase/supabaseClient";

export default function Reminders() {
  const [reminders, setReminders] = useState([]); // Store all reminders
  const [filteredReminders, setFilteredReminders] = useState([]); // Store filtered reminders
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for dialog
  const [reminderToDelete, setReminderToDelete] = useState(null); // Reminder to delete

  // Fetch reminders on component mount
  useEffect(() => {
    const getReminders = async () => {
      const response = await fetchReminders();
      if (response.success) {
        setReminders(response.data); // Set reminders if fetch is successful
        setFilteredReminders(response.data); // Initialize filtered reminders
      } else {
        console.error("Failed to fetch reminders:", response.error);
        setReminders([]);
        setFilteredReminders([]);
      }
    };
    getReminders();
  }, []);

  // Function to filter reminders based on search term
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = reminders.filter(
      (reminder) =>
        reminder.title.toLowerCase().includes(term) ||
        reminder.description.toLowerCase().includes(term)
    );

    setFilteredReminders(filtered); // Update filtered reminders
  };

  // Refresh reminders after adding or deleting one
  const refreshReminders = async () => {
    const response = await fetchReminders();
    if (response.success) {
      setReminders(response.data); // Update reminders dynamically
      setFilteredReminders(response.data); // Reset filtered reminders
    }
  };

  // Handle add reminder
  const handleAddReminder = async () => {
    if (!title || !description || !type) {
      alert("Please fill in all fields.");
      return;
    }

    const newReminder = await addReminder(title, description, type);
    if (newReminder.success) {
      await refreshReminders(); // Refresh reminders after successful addition
      setTitle("");
      setDescription("");
      setType("");
      setSnackbarMessage("Reminder added successfully!"); // Set the snackbar message
      setOpenSnackbar(true); // Trigger notification
    } else {
      setSnackbarMessage("Failed to add reminder: " + newReminder.error); // Show error message
      setOpenSnackbar(true); // Trigger notification
    }
  };

  // Open confirmation dialog before deleting a reminder
  const handleDeleteClick = (reminder) => {
    setReminderToDelete(reminder); // Set reminder to delete
    setOpenConfirmDialog(true); // Open confirmation dialog
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (reminderToDelete) {
      const result = await deleteReminder(reminderToDelete.id);
      if (result.success) {
        await refreshReminders(); // Refresh reminders after successful deletion
        setSnackbarMessage("Reminder deleted successfully!"); // Set the snackbar message
        setOpenSnackbar(true); // Trigger notification
      } else {
        setSnackbarMessage("Failed to delete reminder: " + result.error); // Show error message
        setOpenSnackbar(true); // Trigger notification
      }
      setOpenConfirmDialog(false); // Close dialog after action
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setOpenConfirmDialog(false); // Close dialog without deleting
  };

  // Close Snackbar notification
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={4}>
            <Notifications sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Reminders
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box flex={1} sx={{ px: 4 }}>
              {/* SearchBar */}
              <Stack spacing={4}>
                <TextField
                  size="small"
                  fullWidth
                  id="outlined-size-small"
                  label="Search..."
                  name="search"
                  value={searchTerm}
                  onChange={handleSearch} // Update search term on change
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                {/* LIST OF REMINDERS */}
                <Box
                  spacing={2}
                  sx={{
                    maxHeight: "500px",
                    overflow: "auto",
                  }}
                >
                  {Array.isArray(filteredReminders) &&
                    filteredReminders.map((reminder) => (
                      <Stack
                        key={reminder.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between" // Align icon to the right
                        sx={{ mb: 2 }}
                      >
                        <ReminderCard
                          icon={
                            reminder.reminder_type === "Announcement"
                              ? NewReleases
                              : Campaign
                          }
                          title={reminder.title}
                          description={reminder.description}
                          time={new Date(reminder.created_at).toLocaleString()}
                        />
                        <IconButton
                          onClick={() => handleDeleteClick(reminder)} // Open delete confirmation
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    ))}
                </Box>
              </Stack>
            </Box>
            {/* CREATE REMINDER HERE */}
            <Box flex={2}>
              <Stack spacing={2} sx={{ justifyContent: "start" }}>
                {/* HEADER */}
                <Grid container direction="row">
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-size-small"
                      label="Add Subject"
                      name="subject"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      autoFocus
                    />
                  </Grid>
                  {/* ICON DROPDOWN */}
                  <Grid item xs={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="Announcement">
                          <NewReleases />
                          Announcement
                        </MenuItem>
                        <MenuItem value="Reminder">
                          <Campaign />
                          Reminder
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {/* DESCRIPTION TEXTAREA */}
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  placeholder="Create an Announcement..."
                  multiline
                  rows={18}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {/* BUTTON TO CREATE */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Send />}
                  onClick={handleAddReminder}
                >
                  Send Reminder
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this reminder?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notification */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </Box>
  );
}
