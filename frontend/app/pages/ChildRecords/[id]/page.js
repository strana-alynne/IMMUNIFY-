"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
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
  Edit,
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
  fetchExistingRecords,
  fetchVaccineDetails,
  createSchedBCGHb,
  checkRecordsBCGandHb,
  updateChildDetails,
  updateMotherDetails,
} from "@/utils/supabase/api";
import { useRouter } from "next/navigation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import VaccineAlert from "@/app/components/VaccineAlert";
import GeneralModals from "@/app/components/Modals/Modals";
import EditChildModal from "@/app/components/Modals/EditChildModal";
import MotherAccordion from "@/app/components/MotherAccordion";
import ChildInfoSection from "@/app/components/ChildInfoSection";
import EditMotherModal from "@/app/components/EditMotherModal";
import ChildRecordSkeleton from "@/app/components/ChildRecordSkeleton";
import { toast, Toaster } from "sonner";
import { ContinuousColorLegend } from "@mui/x-charts";
const ChildId = ({ params }) => {
  const child_id_params = params.id;
  const [childData, setChildData] = useState([]);
  const [childStatus, setChildStatus] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [dateAdministered, setDateAdministered] = useState(dayjs());
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [childAge, setChildAge] = useState(0);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMotherModalOpen, setEditMotherModalOpen] = useState(false);

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

  // // Style logic for the chip depending on the child status
  // const getChipColor = (status) => {
  //   const colors = {
  //     Complete: {
  //       backgroundColor: "primary.light",
  //       color: "primary.dark",
  //       fontWeight: "bold",
  //     },
  //     "Partially Complete": {
  //       backgroundColor: "secondary.light",
  //       color: "secondary.dark",
  //       fontWeight: "bold",
  //     },
  //     Missed: {
  //       backgroundColor: "error.light",
  //       color: "error.dark",
  //       fontWeight: "bold",
  //     },
  //   };
  //   return colors[status] || {};
  // };

  const refreshChildData = async () => {
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

      setDropdownOptions(
        fetchedSchedules.filter((s) => s.immunization_records.length === 0)
      );
      setChildAge(calculateAgeInWeeks(data[0].birthdate));
      updateChildStatus(fetchedSchedules);
    }
  };

  useEffect(() => {
    refreshChildData();
  }, [params.id]);

  // Update child's immunization status based on records
  const updateChildStatus = (schedules) => {
    const totalSchedules = schedules.length;
    const completedSchedules = schedules.filter((schedule) =>
      schedule.immunization_records.some(
        (record) => record.completion_status === "Completed"
      )
    ).length;
    const missedSchedules = schedules.filter((schedule) =>
      schedule.immunization_records.some(
        (record) => record.completion_status === "Missed"
      )
    ).length;
    console.log("completedSchedules", completedSchedules);
    console.log("missed", missedSchedules);

    if (missedSchedules) {
      setChildStatus("Missed");
    } else if (completedSchedules === totalSchedules) {
      setChildStatus("Complete");
    } else if (completedSchedules > 0) {
      setChildStatus("Partially Complete");
    }
  };

  const handleBack = () => {
    router.replace(`/pages/ChildRecords`);
  };

  const handleSaveRecord = async () => {
    if (!selectedSchedule || !dateAdministered) {
      toast.error("Please fill out all fields before saving.");
      // alert("Please fill out all fields before saving.");
      return;
    }

    try {
      const selectedScheduleData = dropdownOptions.find(
        (s) => s.sched_id === selectedSchedule
      );

      const dateVac = dateAdministered.format("YYYY-MM-DD");
      const getVacId = selectedScheduleData.vaccine_id;

      // Fetch existing immunization records for the day
      const existingRecords = await fetchExistingRecords(getVacId, dateVac);

      const babiesAdministeredToday = existingRecords.length;
      const totalBabiesToAdminister = babiesAdministeredToday + 1;

      // Fetch vaccine details
      const vaccineData = await fetchVaccineDetails(getVacId);
      const vialsPerBaby = vaccineData.vials_per_baby;

      // Calculate vials needed
      const vialsUsed = totalBabiesToAdminister / vialsPerBaby;
      const inventory_id = await getInventoryId(getVacId);

      if (!Number.isInteger(vialsUsed)) {
        const stockAvailable = await checkVaccineStock(getVacId, vialsUsed);

        if (!stockAvailable) {
          toast.error(
            "Insufficient vaccine stock. Please check your vaccine inventory."
          );
          return;
        } else {
          const newRecord = {
            sched_id: selectedSchedule,
            date_administered: dateVac,
            completion_status: "Completed",
          };
          await newImmunizationRecord(newRecord);
          toast.success("Record saved successfully!");
        }
      } else {
        const stockAvailable = await checkVaccineStock(getVacId, vialsUsed);
        if (!stockAvailable) {
          toast.error(
            "Insufficient vaccine stock. Please check your vaccine inventory."
          );
          return;
        } else {
          const newRecord = {
            sched_id: selectedSchedule,
            date_administered: dateVac,
            completion_status: "Completed",
          };
          await newImmunizationRecord(newRecord);
          toast.success("Record saved successfully!");

          // Update the inventory
          await addVaccineStock({
            transaction_date: dateVac,
            transaction_type: "STOCK OUT",
            transaction_quantity: vialsUsed,
            inventory_id: inventory_id,
          });
        }
      }

      const isBCGorHepB = ["V001", "V002"].includes(getVacId);

      if (isBCGorHepB) {
        const checkRecords = await checkRecordsBCGandHb(params.id);
        if (checkRecords === false) {
          await createSchedBCGHb(params.id, dateAdministered.toDate());
        }
      } else {
        // Schedule the next dose if applicable
        const vaccine = vaccineSchedule.find(
          (v) => v.id === selectedScheduleData.vaccine_id
        );
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
          const newSchedule = await createNewSchedule(
            params.id,
            vaccine.id,
            nextScheduledDate
          );
          setSchedules((prev) => [...prev, newSchedule]);
          setDropdownOptions((prev) => [
            ...prev.filter(
              (schedule) => schedule.sched_id !== selectedSchedule
            ),
            newSchedule,
          ]);
        } else {
          setDropdownOptions((prev) =>
            prev.filter((schedule) => schedule.sched_id !== selectedSchedule)
          );
        }
      }

      await refreshChildData();
      setSelectedSchedule("");
      setDateAdministered(dayjs());
    } catch (error) {}
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditMotherClick = () => {
    setEditMotherModalOpen(true);
  };

  const handleCloseEditMotherModal = () => {
    setEditMotherModalOpen(false);
  };

  const handleSaveMotherData = async (editedData) => {
    try {
      // Add this function to your api.js file
      await updateMotherDetails(childData[0].Mother.mother_id, editedData);
      await refreshChildData();
      toast.success("Mother's details updated successfully!");
      // alert("Mother's details updated successfully!");
    } catch (error) {
      toast.error("Failed to update mother's details. Please try again.");
      // alert("Failed to update mother's details. Please try again.");
    }
  };

  const handleSaveEditedData = async (editedData) => {
    try {
      await updateChildDetails(params.id, editedData);
      await refreshChildData();
      toast.success("Child details updated successfully!");
      // alert("Child details updated successfully!");
    } catch (error) {
      toast.error("Failed to update child details. Please try again.");
      // alert("Failed to update child details. Please try again.");
    }
  };

  if (!childData.length) {
    return <ChildRecordSkeleton />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Toaster
        richColors
        position="top-right"
        severity="error"
        autoHideDuration={3000}
      />
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
              color="primary"
              startIcon={<Edit />}
              xs={2}
              onClick={handleEditClick}
            >
              Edit Record
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Edit />}
              onClick={handleEditMotherClick}
            >
              Edit Mother's Details
            </Button>
          </Stack>

          {childData.map((row) => (
            <Paper sx={{ p: 4 }} key={row.child_id}>
              <ChildInfoSection childData={row} childStatus={childStatus} />
              <MotherAccordion motherData={row.Mother} />
            </Paper>
          ))}
          <VaccineAlert />
          <Paper elevation={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
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
                      <MenuItem
                        key={schedule.sched_id}
                        value={schedule.sched_id}
                      >
                        {`${schedule.vaccine_name} - ${dayjs(
                          schedule.scheduled_date
                        ).format("MMM D, YYYY")}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
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
          </Paper>
          <ChildCard
            schedule={schedules}
            onDataChange={refreshChildData}
            child_id={child_id_params}
          />
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
      <EditChildModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        childData={childData[0]}
        onSave={handleSaveEditedData}
      />

      <EditMotherModal
        open={editMotherModalOpen}
        onClose={handleCloseEditMotherModal}
        motherData={childData[0]?.Mother}
        onSave={handleSaveMotherData}
      />
    </Box>
  );
};

export default ChildId;
