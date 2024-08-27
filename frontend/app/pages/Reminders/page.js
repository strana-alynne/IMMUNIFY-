"use client";
import SideBar from "@/app/components/SideBar/page";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReminderCard from "@/app/components/ReminderCard";
import {
  Notifications,
  NewReleases,
  Campaign,
  Send,
} from "@mui/icons-material";
export default function Reminders() {
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
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
                {/* LIST OF REMINDERS */}
                <Box
                  spacing={2}
                  sx={{
                    maxHeight: "500px", // Adjust the height as needed
                    overflow: "auto",
                  }}
                >
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule Tomorrow"
                    description="This is to remind you that your baby Angelo is scheduled to have their vaccination tomorrow."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={Campaign}
                    title="Doctor Appointment"
                    description="You have a doctor appointment scheduled at 10 AM tomorrow."
                    time="5hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Meeting Reminder"
                    description="Team meeting at 2 PM tomorrow. Don't forget to prepare the presentation."
                    time="1hr"
                  />
                  <ReminderCard
                    icon={Campaign}
                    title="Gym Session"
                    description="You have a gym session at 7 AM tomorrow. Time to get fit!"
                    time="10hr"
                  />
                </Box>
              </Stack>
            </Box>
            {/*CREATE REMINDER HERE */}
            <Box flex={2}>
              <Stack spacing={2} sx={{ justifyContent: "start" }}>
                {/* HEADER */}
                <Grid container direction="row">
                  {/* SUBJECT TEXTFIELD */}
                  <Grid item xs={8}>
                    <TextField
                      size="small"
                      fullWidth
                      id="outlined-size-small"
                      label="Add Subject"
                      name="subject"
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
                        //value={age}
                        label="Type"
                        //onChange={handleChange}
                      >
                        <MenuItem value={20}>
                          <NewReleases />
                          Announcement
                        </MenuItem>
                        <MenuItem value={30}>
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
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end", // Aligns the button to the right
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Send />}
                    sx={{ "& button": { m: 1 } }}
                  >
                    Send Reminder
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
