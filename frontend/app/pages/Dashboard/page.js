"use client";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashBoardCard from "@/app/components/DashBoardCard";
import ReminderCard from "@/app/components/ReminderCard";
import { Group, Face, EventBusy, NewReleases } from "@mui/icons-material";
import Map from "@/app/components/Map";
import VaccineAlert from "@/app/components/VaccineAlert";

export default function Dashboard() {
  const address =
    "2GJ7+H26, Barangay Dumoy, Davao City, Davao, McArthur Highway, Toril, Davao City, Davao del Sur"; // Example address

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <DashboardIcon sx={{ fontSize: 40 }} color="primary" />
            <Typography variant="h2" color="primary">
              Dashboard
            </Typography>
          </Stack>
        </Stack>
        <div style={{ paddingBottom: 20 }}>
          <VaccineAlert />
        </div>
        {/* Population Cards */}
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <DashBoardCard
              icon={Group}
              title="20,373"
              description="Population as 2024"
              color="primary"
            />
          </Grid>
          <Grid item xs={4}>
            <DashBoardCard
              icon={Face}
              title="303"
              description="Total number of Babies as 2024"
              color="secondary"
            />
          </Grid>
          <Grid item xs={4}>
            <DashBoardCard
              icon={EventBusy}
              title="303"
              description="Total number of Babies as 2024"
              color="error"
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6} marginTop={5}>
            <Typography variant="h5" color="primary" marginBottom={2}>
              DEFAULTER ANALYSIS
            </Typography>
            <Map />
          </Grid>
          <Grid item xs={4} direction="column" marginLeft={24} marginTop={5}>
            {/* Appointments and Messages Section */}
            <Grid item spacing={4}>
              <Typography variant="h6" color="primary">
                Appointments
                <Box
                  spacing={2}
                  sx={{
                    maxHeight: "400px", // Adjust the height as needed
                    overflow: "auto",
                  }}
                >
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                </Box>
              </Typography>
            </Grid>
            <Grid item spacing={2}>
              <Typography variant="h6" color="primary">
                Messages
              </Typography>
              <Box
                spacing={2}
                sx={{
                  maxHeight: "400px", // Adjust the height as needed
                  overflow: "auto",
                }}
              >
                <ReminderCard
                  icon={NewReleases}
                  title="Vaccine Schedule"
                  description="This is to remind you that your baby Angelo is ..."
                  time="3hr"
                />
                <ReminderCard
                  icon={NewReleases}
                  title="Vaccine Schedule"
                  description="This is to remind you that your baby Angelo is ..."
                  time="3hr"
                />
                <ReminderCard
                  icon={NewReleases}
                  title="Vaccine Schedule"
                  description="This is to remind you that your baby Angelo is ..."
                  time="3hr"
                />
                <ReminderCard
                  icon={NewReleases}
                  title="Vaccine Schedule"
                  description="This is to remind you that your baby Angelo is ..."
                  time="3hr"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
