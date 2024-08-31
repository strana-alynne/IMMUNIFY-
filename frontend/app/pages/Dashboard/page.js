"use client";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Grid } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashBoardCard from "@/app/components/DashBoardCard";
import ReminderCard from "@/app/components/ReminderCard";
import {
  Group,
  NewReleases,
  Campaign,
  Send,
  Face,
  EventBusy,
} from "@mui/icons-material";
import Map from "@/app/components/Map";
export default function Dashboard() {
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
          <Grid item xs={8}>
            <Typography variant="h6" color="primary">
              DEFAULTER ANALYSIS
            </Typography>
            <Map />
          </Grid>
          <Grid item xs={4} direction="column">
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
