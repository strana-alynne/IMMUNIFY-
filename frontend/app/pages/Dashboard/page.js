"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashBoardCard from "@/app/components/DashBoardCard";
import ReminderCard from "@/app/components/ReminderCard";
import { Group, Face, EventBusy, NewReleases } from "@mui/icons-material";
import Map from "@/app/components/Map";
import VaccineAlert from "@/app/components/VaccineAlert";

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box display="flex">
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <DashboardIcon
              sx={{ fontSize: { xs: 30, sm: 40 } }}
              color="primary"
            />
            <Typography variant={isMobile ? "h4" : "h2"} color="primary">
              Dashboard
            </Typography>
          </Stack>
        </Stack>
        <div style={{ paddingBottom: 20 }}>
          <VaccineAlert />
        </div>
        {/* Population Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={Group}
              title="20,373"
              description="Population as 2024"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={Face}
              title="303"
              description="Number of Babies as 2024"
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={EventBusy}
              title="303"
              description="Number of Defaulted Babies as 2024"
              color="error"
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={{
            xs: 0,
            sm: 2,
            md: 3,
            lg: 4,
          }}
        >
          <Grid item xs={12} sm={12} md={8} lg={8} marginTop={5}>
            <Typography variant="h5" color="primary" marginBottom={2}>
              DEFAULTER ANALYSIS
            </Typography>
            <Map />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            direction="column"
            marginTop={5}
          >
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
