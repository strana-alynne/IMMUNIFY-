"use client";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Grid, Card, CardContent, Button } from "@mui/material";
import AppointmentIcon from "@mui/icons-material/CalendarMonth";
import { useState } from "react";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import styles for DateRangePicker
import 'react-date-range/dist/theme/default.css'; // Import theme for DateRangePicker

export default function Appointments() {
  const [appointments, setAppointments] = useState([
    { id: 1, name: "Jas", vaccine: "Polio", date: "2024-09-15", status: "Scheduled" },
    { id: 2, name: "Jane", vaccine: "MMR", date: "2024-09-20", status: "Pending" },
    { id: 3, name: "Sam", vaccine: "Hepatitis B", date: "2024-09-25", status: "Completed" }
  ]);

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <AppointmentIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Appointments
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="body1" color="text.primary">
                Messaging / Appointments
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={1} md={4}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: '#145B50' }}>
                  <Typography variant="h6" color="white" sx={{ textAlign: 'center' }}>
                    UPCOMING SCHEDULES
                  </Typography>
                  
                  {/* Subtitles */}
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}><Typography variant="subtitle2" color="#FEF7EE">Name</Typography></Grid>
                      <Grid item xs={3}><Typography variant="subtitle2" color="#FEF7EE">Vaccine</Typography></Grid>
                      <Grid item xs={3}><Typography variant="subtitle2" color="#FEF7EE">Date</Typography></Grid>
                      <Grid item xs={3}><Typography variant="subtitle2" color="#FEF7EE">Status</Typography></Grid>
                    </Grid>
                  </Box>

                  {/* Appointment List */}
                  <Stack spacing={2} mt={2}>
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} sx={{ mb: 1 }}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={3}><Typography variant="body2">{appointment.name}</Typography></Grid>
                            <Grid item xs={3}><Typography variant="body2">{appointment.vaccine}</Typography></Grid>
                            <Grid item xs={3}><Typography variant="body2">{appointment.date}</Typography></Grid>
                            <Grid item xs={3}><Typography variant="body2">{appointment.status}</Typography></Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', p: 2, border: '1px solid #ddd', borderRadius: 2, bgcolor: '#f9f9f9', width: '650px', height: '500px', ml: 10 }}>               
                   <Typography variant="h6" color="primary" sx={{ textAlign: 'center', mb: 2 }}>
                    Calendar
                  </Typography>
                  <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={item => setSelectionRange(item.selection)}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    direction="horizontal"
                    style={{ width: '200px' }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ position: 'absolute', top: 16, right: 16 }}
                    onClick={() => alert('Add Appointment Clicked')}
                  >
                    Add Appointment
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
