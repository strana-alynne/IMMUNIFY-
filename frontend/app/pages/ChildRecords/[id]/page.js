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
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Face as FaceIcon,
  Face2,
  Edit,
  DeleteForever,
  Face,
  ArrowBack,
  Check,
  Inventory2,
} from "@mui/icons-material";
import ChildCard from "./card";
import dayjs from "dayjs";
import {
  fetchChild,
  newImmunizationRecord,
  createNewSchedule,
  checkVaccineStock,
  getInventoryId,
  addVaccineStock,
} from "@/utils/supabase/api";
import { useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import schedModal from "@/app/components/Modals/schedModal";
import VaccineAlert from "@/app/components/VaccineAlert";
import GeneralModals from "@/app/components/Modals/Modals";

const ChildId = ({ params }) => {
  const [childData, setChildData] = useState([]);
  const [childStatus, setChildStatus] = useState("Missed");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [dateAdministered, setDateAdministered] = useState(dayjs());
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [childAge, setChildAge] = useState(0);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Calculate age in weeks based on birthdate
  const calculateAgeInWeeks = (birthdate) => {
    const birth = new Date(birthdate);
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)); // Convert to weeks
  };

  const vaccineSchedule = [
    { id: "V001", name: "BCG", nextDose: null, totalDoses: 1 },
    { id: "V002", name: "Hepatitis B", nextDose: null, totalDoses: 1 },
    { id: "V003", name: "Penta", nextDose: 4 * 7, totalDoses: 3 },
    { id: "V004", name: "OPV", nextDose: 22 * 7, totalDoses: 2 },
    { id: "V005", name: "PCV", nextDose: 4 * 7, totalDoses: 3 },
    { id: "V006", name: "IPV", nextDose: 4 * 7, totalDoses: 3 },
    { id: "V007", name: "MMR", nextDose: 12 * 4 * 7, totalDoses: 2 },
  ];
  // Style logic for the chip depending on the child status
  const getChipColor = (status) => {
    const colors = {
      Complete: {
        backgroundColor: "primary.light",
        color: "primary.dark",
        fontWeight: "bold",
      },
      "Partially Complete": {
        backgroundColor: "secondary.light",
        color: "secondary.dark",
        fontWeight: "bold",
      },
      Missed: {
        backgroundColor: "error.light",
        color: "error.dark",
        fontWeight: "bold",
      },
    };
    return colors[status] || {};
  };

  //CHILD DATE
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChild(params.id);
      setChildData(data || []);
      if (data && data.length > 0) {
        const fetchedSchedules = data[0].Schedule.map((schedule) => ({
          sched_id: schedule.sched_id,
          scheduled_date: schedule.scheduled_date,
          vaccine_id: schedule.Vaccine.vaccine_id,
          vaccine_name: schedule.Vaccine.vaccine_name,
          immunization_records: schedule.ImmunizationRecords.map((record) => ({
            record_id: record.record_id,
            date_administered: record.date_administered,
            completion_status: record.completion_status,
          })),
        }));

        setSchedules(fetchedSchedules);
        const filteredOptions = fetchedSchedules.filter(
          (s) => s.immunization_records.length === 0
        );
        console.log("Dropdown contents:", filteredOptions);

        setDropdownOptions(
          fetchedSchedules.filter((s) => s.immunization_records.length === 0)
        );
        setChildAge(calculateAgeInWeeks(data[0].birthdate));
        updateChildStatus(fetchedSchedules);
      }
    };

    fetchData();
  }, [params.id]);

  //VACCINES QUANTITY
  // Update child's immunization status based on records
  const updateChildStatus = (schedules) => {
    const totalSchedules = schedules.length;
    const completedSchedules = schedules.filter((schedule) =>
      schedule.immunization_records.some(
        (record) => record.completion_status === "Completed"
      )
    ).length;

    if (completedSchedules === totalSchedules) {
      setChildStatus("Complete");
    } else if (completedSchedules > 0) {
      setChildStatus("Partially Complete");
    } else {
      setChildStatus("Missed");
    }
  };

  const handleBack = () => {
    router.replace(`/pages/ChildRecords`);
  };

  const handleSaveRecord = async () => {
    if (!selectedSchedule || !dateAdministered) {
      alert("Please fill out all fields before saving.");
      return;
    }

    try {
      const selectedScheduleData = dropdownOptions.find(
        (s) => s.sched_id === selectedSchedule
      );

      console.log("selectedScheduleData", selectedScheduleData);
      const dateVac = dateAdministered.format("YYYY-MM-DD");
      const getVacId = selectedScheduleData.vaccine_id;
      const inventory_id = await getInventoryId(getVacId);
      const stock = await checkVaccineStock(getVacId, 1);
      console.log("stok", stock);

      const vaccineStockDetails = {
        transaction_date: dateVac,
        transaction_type: "STOCK OUT",
        transaction_quantity: parseInt(1),
        inventory_id: inventory_id,
      };

      if (stock === true) {
        if (!selectedScheduleData) {
          throw new Error(
            "No matching schedule found for the selected vaccine."
          );
        }
        const newRecord = {
          sched_id: selectedSchedule,
          date_administered: dateAdministered.toISOString(),
          completion_status: "Completed",
        };
        await newImmunizationRecord(newRecord);
        alert("Record saved successfully!");

        //ADD VACCINE TRANSACTION
        await addVaccineStock(vaccineStockDetails);

        // Find the vaccine in the vaccineSchedule
        const vaccine = vaccineSchedule.find(
          (v) => v.id === selectedScheduleData.vaccine_id
        );

        // Count how many doses of this vaccine have been administered
        const administeredDoses = schedules.filter(
          (s) =>
            s.vaccine_id === vaccine.id && s.immunization_records.length > 0
        ).length;
        if (
          vaccine &&
          vaccine.nextDose &&
          administeredDoses + 1 < vaccine.totalDoses
        ) {
          const nextScheduledDate = dayjs(dateAdministered)
            .add(vaccine.nextDose, "day")
            .toISOString();
          console.log("nextSchedul:", nextScheduledDate);
          const newSchedule = await createNewSchedule(
            params.id,
            vaccine.id,
            nextScheduledDate
          );
          console.log("newSchedule", newSchedule);
          setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
          setDropdownOptions((prevOptions) => [
            ...prevOptions.filter(
              (schedule) => schedule.sched_id !== selectedSchedule
            ),
            newSchedule,
          ]);
        } else {
          // Remove the current schedule from dropdownOptions
          setDropdownOptions((prevOptions) =>
            prevOptions.filter(
              (schedule) => schedule.sched_id !== selectedSchedule
            )
          );
        }
        // Refresh child data and update states
        const data = await fetchChild(params.id);
        setChildData(data || []);
        if (data && data.length > 0) {
          const fetchedSchedules = data[0].Schedule.map((schedule) => ({
            sched_id: schedule.sched_id,
            scheduled_date: schedule.scheduled_date,
            vaccine_id: schedule.Vaccine.vaccine_id,
            vaccine_name: schedule.Vaccine.vaccine_name,
            overallStatus: schedule.overallStatus,
            immunization_records: schedule.ImmunizationRecords.map(
              (record) => ({
                date_administered: record.date_administered,
                completion_status: record.completion_status,
              })
            ),
          }));
          setSchedules(fetchedSchedules);
          setDropdownOptions(
            fetchedSchedules.filter((s) => s.immunization_records.length === 0)
          );
          updateChildStatus(fetchedSchedules);
        }
        //Reset form fields
        setSelectedSchedule("");
        setDateAdministered(dayjs());
      } else {
        setModalContent(
          "Insufficient vaccine stock. Please check your vaccine inventory."
        );
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error saving record:", error.message);
    }
  };

  if (!childData.length) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={handleBack}>
                <ArrowBack sx={{ fontSize: 40 }} color="primary" />
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

          {childData.map((row) => (
            <Paper sx={{ p: 4 }} key={row.child_id}>
              <Stack direction="row" spacing={8}>
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
                          <strong>Email Address: </strong>{" "}
                          {row.Mother.mother_email}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack sx={{ textAlign: "start" }}>
                  <Typography variant="h6_regular">
                    Immunization Status
                  </Typography>
                  <Chip label={childStatus} sx={getChipColor(childStatus)} />
                </Stack>
              </Stack>
            </Paper>
          ))}
          <VaccineAlert />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="schedule-label">Vaccine Schedule</InputLabel>
                <Select
                  labelId="schedule-label"
                  id="schedule"
                  value={selectedSchedule}
                  onChange={(e) => setSelectedSchedule(e.target.value)}
                  label="Vaccine Schedule"
                >
                  {dropdownOptions.map((schedule) => (
                    <MenuItem key={schedule.sched_id} value={schedule.sched_id}>
                      {`${schedule.vaccine_name} - ${dayjs(
                        schedule.scheduled_date
                      ).format("MMM D, YYYY")}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date Administered"
                  value={dateAdministered}
                  onChange={(newDate) => setDateAdministered(newDate)}
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
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Check />}
                onClick={handleSaveRecord}
                sx={{ mt: 2 }}
              >
                Save Record
              </Button>
            </Grid>
          </Grid>
          <ChildCard schedule={schedules} />
        </Stack>
      </Container>
      <GeneralModals
        color="error"
        open={openModal}
        onClose={handleCloseModal}
        icon={<Inventory2 sx={{ fontSize: 64 }} />}
        title="No Stock Available"
        content={
          <div>
            <p>{modalContent}</p>
          </div>
        }
        actions={
          <Button variant="contained" color="info" onClick={handleCloseModal}>
            Close
          </Button>
        }
      />
    </Box>
  );
};

export default ChildId;
