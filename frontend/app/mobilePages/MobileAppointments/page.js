"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Avatar,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
//import MobileSideBar from "../MobileSideBar/page";
import Calendar from "react-calendar"; // Install 'react-calendar' with `npm install react-calendar`
import "react-calendar/dist/Calendar.css"; // Import CSS for calendar styling

// Dummy appointment data
const appointments = [
  {
    id: 1,
    name: "Routine Checkup",
    date: new Date(2024, 8, 10),
    time: "10:00 AM",
    location: "Clinic A",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Vaccination",
    date: new Date(2024, 8, 12),
    time: "02:00 PM",
    location: "Clinic B",
    status: "Completed",
  },
  {
    id: 3,
    name: "Follow-up Visit",
    date: new Date(2024, 8, 15),
    time: "01:00 PM",
    location: "Clinic A",
    status: "Cancelled",
  },
];

export default function AppointmentPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleRowClick = (id) => {
    router.replace(`/pages/Appointments/${id}`);
  };

  const handleEdit = (id) => {
    router.replace(`/pages/Appointments/EditAppointment/${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete functionality here
    console.log(`Delete appointment with ID: ${id}`);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter appointments based on the selected date
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.date.toDateString() === selectedDate.toDateString()
  );

  // Separate upcoming and past appointments
  const today = new Date();
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.date >= today
  );
  const pastAppointments = appointments.filter(
    (appointment) => appointment.date < today
  );

  const getChipColor = (status) => {
    switch (status) {
      case "Scheduled":
        return { backgroundColor: "primary.light", color: "primary.dark" };
      case "Completed":
        return { backgroundColor: "secondary.light", color: "secondary.dark" };
      case "Cancelled":
        return { backgroundColor: "error.light", color: "error.dark" };
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "390px", // iPhone 12 Pro screen width
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Sidebar */}
      {/* <MobileSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          paddingLeft: sidebarOpen ? "240px" : "0",
          transition: "padding-left 0.3s",
        }}
      >
        {/* Top Bar */}
        {/* Logo */}
        <img
          src="/logo-wordmark.png"
          alt="IMMUNIFY logo"
          style={{
            width: "160px",
            margin: "16px 0",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {/* Calendar */}
        <Typography
          variant="h6"
          color="primary"
          marginBottom={2}
          textAlign="center"
        >
          Select a date to view appointments
        </Typography>
        <Stack direction="row" justifyContent="center" marginBottom={2}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            view="month"
            showNavigation={true}
            style={{ width: "90%", maxWidth: "300px" }}
          />
        </Stack>

        {/* Upcoming Appointments */}
        <Typography variant="h6" color="primary" gutterBottom marginBottom={2}>
          Upcoming Appointments
        </Typography>
        <Container>
          <Grid container spacing={1}>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card
                    onClick={() => handleRowClick(appointment.id)}
                    sx={{ cursor: "pointer", boxShadow: 3 }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar>{appointment.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2">
                            {appointment.name}
                          </Typography>
                          <Typography variant="caption">
                            Date: {appointment.date.toDateString()}
                          </Typography>
                          <Typography variant="caption">
                            Time: {appointment.time}
                          </Typography>
                          <Typography variant="caption">
                            Location: {appointment.location}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Chip
                        label={appointment.status}
                        sx={getChipColor(appointment.status)}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(appointment.id);
                        }}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(appointment.id);
                        }}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No upcoming appointments.
              </Typography>
            )}
          </Grid>
        </Container>

        {/* Past Appointments */}
        <Typography
          variant="h6"
          color="primary"
          gutterBottom
          marginTop={4}
          marginBottom={2}
        >
          Past Appointments
        </Typography>
        <Container>
          <Grid container spacing={1}>
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card
                    onClick={() => handleRowClick(appointment.id)}
                    sx={{ cursor: "pointer", boxShadow: 3 }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar>{appointment.name[0]}</Avatar>
                        <Box>
                          <Typography variant="body2">
                            {appointment.name}
                          </Typography>
                          <Typography variant="caption">
                            Date: {appointment.date.toDateString()}
                          </Typography>
                          <Typography variant="caption">
                            Time: {appointment.time}
                          </Typography>
                          <Typography variant="caption">
                            Location: {appointment.location}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Chip
                        label={appointment.status}
                        sx={getChipColor(appointment.status)}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(appointment.id);
                        }}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(appointment.id);
                        }}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No past appointments.
              </Typography>
            )}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
