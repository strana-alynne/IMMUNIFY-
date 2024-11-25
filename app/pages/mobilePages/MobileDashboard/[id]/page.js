"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MobileSideBar from "@/app/components/MobileSideBar";
import AppBarMobile from "@/app/components/AppBarMobile";
import { fetchChild } from "@/utils/supabase/api";
import { Face, Face2 } from "@mui/icons-material";
// Make sure this path is correct for your project structure
import MobileCard from "./mobileCard";

const ChildDetails = ({ params }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [childData, setChildData] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const theme = useTheme();
  const [childStatus, setChildStatus] = useState([]);

  const getChipColor = (status) => {
    switch (status) {
      case "Complete":
        return {
          backgroundColor: "primary.light",
          color: "primary.dark",
          fontWeight: "bold",
        };
      case "Partially Complete":
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
        return "default";
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  useEffect(() => {
    async function loadChild() {
      try {
        const data = await fetchChild(params.id);
        console.log("data", data);
        setChildData(data || []);

        if (data && data.length > 0) {
          const fetchedSchedules = data[0].Schedule.map((schedule) => ({
            sched_id: schedule.sched_id,
            scheduled_date: schedule.scheduled_date,
            vaccine_id: schedule.Vaccine.vaccine_id,
            vaccine_name: schedule.Vaccine.vaccine_name,
            immunization_records: schedule.ImmunizationRecords.map(
              (record) => ({
                record_id: record.record_id,
                date_administered: record.date_administered,
                completion_status: record.completion_status,
              })
            ),
          }));
          setSchedules(fetchedSchedules);
          updateChildStatus(fetchedSchedules);
        }
      } catch (error) {
        console.error(error);
      }
    }
    loadChild();
  }, [params.id]);

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        padding: "16px",
      }}
    >
      <MobileSideBar open={open} toggleDrawer={toggleDrawer} />
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <AppBarMobile toggleDrawer={toggleDrawer} />

        <Typography variant="h4" color="primary" gutterBottom textAlign="left">
          Child Details
        </Typography>
        {childData.map((row) => (
          <Card key={row.child_id} sx={{ boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={0.5}>
                {row.gender === "Female" ? (
                  <Face2 color="secondary" style={{ fontSize: "40px" }} />
                ) : (
                  <Face color="primary" style={{ fontSize: "40px" }} />
                )}
                <Typography variant="h6">{row.child_name}</Typography>
                <Typography variant="body2">
                  <strong>Age: </strong>
                  {row.child_age} months
                </Typography>
                <Typography variant="body2">
                  <strong>Birthday: </strong>
                  {row.birthdate}
                </Typography>
                <Box />
                <Box />
                <div>
                  <Typography variant="body2">Immunization Status</Typography>
                  <Chip label={childStatus} sx={getChipColor(childStatus)} />
                </div>
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Typography variant="h5" color="primary">
          Immunization Card
        </Typography>

        <Box
          sx={{
            flex: 1,
            minHeight: 0, // This is crucial for nested flex containers
            overflow: "hidden", // This ensures the MobileCard's scroll doesn't affect parent
          }}
        >
          {schedules.length > 0 && <MobileCard schedule={schedules} />}
        </Box>
      </Box>
    </Box>
  );
};

export default ChildDetails;
