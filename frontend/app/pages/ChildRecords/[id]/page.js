"use client";
import { useState, useEffect } from "react";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Paper,
  Button,
  IconButton,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  InputAdornment,
  Grid,
  Snackbar,
} from "@mui/material";
import {
  Face as FaceIcon,
  Face2,
  Edit,
  DeleteForever,
  Face,
  ArrowBack,
  Check,
} from "@mui/icons-material";
import ChildCard from "./card";
import { fetchChild } from "@/utils/supabase/api";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const ChildId = ({ params }) => {
  const [childData, setChildData] = useState([]);
  const [childStatus, setChildStatus] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const router = useRouter();

  const getChipColor = (status) => {
    switch (status) {
      case "Complete":
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

  useEffect(() => {
    const childStatus = localStorage.getItem("childStatus");
    const fetchData = async () => {
      const data = await fetchChild(params.id);
      setChildData(data || []);
      console.log(data);

      if (data && data.length > 0) {
        const schedules = data[0].Schedule.map((schedule) => ({
          scheduled_date: schedule.scheduled_date,
          vaccine_id: schedule.vaccine_id,
          immunization_records: schedule.ImmunizationRecords.map((record) => ({
            date_administered: record.date_administered,
            completion_status: record.completion_status,
          })),
        }));

        setSchedules(schedules);
        console.log(schedules); // Set the extracted schedule data into state
      }
      setChildStatus(childStatus);
    };

    fetchData();
  }, [params.id]);

  const handleBack = () => {
    router.replace(`/pages/ChildRecords`);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <IconButton>
                <ArrowBack
                  sx={{ fontSize: 40 }}
                  color="primary"
                  onClick={handleBack}
                />
              </IconButton>
              <FaceIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h2" color="primary">
                Child Records
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              Child ID: <strong>{params.id}</strong>
            </Typography>
          </Stack>

          <Stack direction="row-reverse" spacing={2}>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForever />}
              xs={2}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              xs={2}
            >
              Edit Record
            </Button>
          </Stack>
          {/* INFORMATION */}

          {childData.map((row) => (
            <Paper sx={{ p: 4 }}>
              <Stack direction="row" spacing={8}>
                {/* CHILD DETAILS */}
                <Stack direction="row" spacing={2}>
                  {row.gender === "Female" ? (
                    <Face2 sx={{ fontSize: 100 }} color="secondary" />
                  ) : (
                    <Face sx={{ fontSize: 100 }} color="primary" />
                  )}
                  <Stack spacing={0.5}>
                    <Typography variant="h5">{row.child_name}</Typography>
                    <Stack direction="row" spacing={0}>
                      <Stack>
                        <Typography variant="p">
                          <strong>Age: </strong> {row.child_age} years
                        </Typography>
                        <Typography variant="p">
                          <strong>Sex: </strong> {row.gender}
                        </Typography>
                        <Typography variant="p">
                          <strong>Birthdate: </strong> {row.birthdate}
                        </Typography>
                      </Stack>
                      <Stack>
                        <Typography variant="p">
                          <strong>Address: </strong> {row.address}
                        </Typography>
                        <Typography variant="p">
                          <strong>Weight: </strong> 7 kg
                        </Typography>
                        <Typography variant="p">
                          <strong>Height: </strong> 64.4 inches
                        </Typography>
                      </Stack>
                      <Stack>
                        <Typography variant="p">
                          <strong>Mother's name: </strong>{" "}
                          {row.Mother.mother_name}
                        </Typography>
                        <Typography variant="p">
                          <strong>Contact Number: </strong>{" "}
                          {row.Mother.contact_number}
                        </Typography>
                        <Typography variant="p">
                          <strong>Email Address: </strong>
                          {row.Mother.mother_email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                {/* IMMUNIZATION STATUS */}
                <Stack sx={{ textAlign: "start" }}>
                  <Typography variant="h6_regular">
                    Immunization Status
                  </Typography>
                  <Chip label={childStatus} sx={getChipColor(childStatus)} />
                </Stack>
              </Stack>
            </Paper>
          ))}
          {/* IMMUNIZATION CARD */}

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="vaccine-name-label">Vaccine</InputLabel>
                <Select
                  labelId="vaccine-name-label"
                  id="vaccine-name"
                  // value={transactionType}
                  // onChange={handleTransactionTypeChange}
                  label="Vaccine"
                >
                  <MenuItem value="V001">
                    BCG (Bacillus-Calmette-Guerin)
                  </MenuItem>
                  <MenuItem value="V002">Hepatitis B</MenuItem>
                  <MenuItem value="V003">Penta: DTwP-HepBHib</MenuItem>
                  <MenuItem value="V004">
                    PCV (Pnuemococcal Conjugate Vaccine)
                  </MenuItem>
                  <MenuItem value="V005">OPV</MenuItem>
                  <MenuItem value="V006">IPV (Inactive Polio Vaccine)</MenuItem>
                  <MenuItem value="V007">
                    MMR (Measles - Mumps - Rubella Vaccine)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Administered"
                  // value={expirationDate}
                  // onChange={handleExpirationDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  slotProps={{
                    textField: {
                      margin: "normal",
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="vaccine-name-label">Dose</InputLabel>
                <Select
                  labelId="vaccine-name-label"
                  id="vaccine-name"
                  label="Dose"
                >
                  <MenuItem value="1st"> 1st Dose </MenuItem>
                  <MenuItem value="2nd"> 2nd Dose </MenuItem>
                  <MenuItem value="3rd"> 3rd Dose </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              {" "}
              <Button
                variant="contained"
                color="primary"
                startIcon={<Check />}
                xs={2}
              >
                Save Record
              </Button>
            </Grid>
          </Grid>
          <ChildCard schedule={schedules} />
        </Stack>
      </Container>
    </Box>
  );
};

export default ChildId;
