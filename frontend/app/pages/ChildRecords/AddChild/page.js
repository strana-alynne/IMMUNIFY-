"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Childinfo from "./childinfo";
import Motherinfo from "./motherinfo";
import { ArrowBack, Check, CheckCircle } from "@mui/icons-material";
import { addChild, createMotherAccount } from "@/utils/supabase/api";
import GeneralModals from "@/app/components/Modals/Modals";
import { useRouter } from "next/navigation";
import { geocodeAddress, handleSchedules } from "@/utils/supabase/api"; // Use the correct import for default export

export default function AddChild() {
  const router = useRouter();
  const [motherData, setMotherData] = useState({});
  const [childData, setChildData] = useState({});
  const [purok, setSelectedPurok] = useState("");
  const [growth, setGrowthData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({});
  const [address, setAddress] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [triggerErrorCheck, setTriggerErrorCheck] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSave = async () => {
    // Trigger error checking in child components
    setTriggerErrorCheck(true);

    // Check if all required fields are filled and there are no errors
    const childInfoComplete =
      Object.values(childData).every(
        (field) => field !== "" && field !== null && field !== undefined
      ) && !childData.hasErrors; // Assuming childData.hasErrors is set by Childinfo component

    const motherInfoComplete =
      Object.values(motherData).every(
        (field) => field !== "" && field !== null && field !== undefined
      ) && !motherData.hasErrors; // Assuming motherData.hasErrors is set by Motherinfo component

    if (!childInfoComplete || !motherInfoComplete) {
      // If there are errors or empty fields, don't proceed with submission
      console.log("Please fill all required fields correctly");
      return;
    }

    try {
      const getAddress = await geocodeAddress(address);
      const result = await createMotherAccount(motherData);
      if (result.error) {
        return;
      }
      await addChild(result.motherData, childData, purok, growth, getAddress);
      const childid = localStorage.getItem("child_id");

      await handleSchedules(scheduleData, childid);
    } catch (error) {
      console.error("Error saving child data:", error);
    }
    setOpenModal(true);
  };

  const handleClose = () => {
    const childid = localStorage.getItem("child_id");
    router.push(`./${childid}`);
  };

  const handleBack = () => {
    router.replace(`/pages/ChildRecords`);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <IconButton>
                <ArrowBack
                  sx={{ fontSize: { lg: 40, md: 40, sm: 28 } }}
                  color="primary"
                  onClick={handleBack}
                />
              </IconButton>
              <FaceIcon
                sx={{ fontSize: { lg: 40, md: 40, sm: 28 } }}
                color="primary"
              />
              <Typography
                variant={isMobile || isTablet ? "h4" : "h2"}
                color="primary"
              >
                Child Records
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              + Add Child Record
            </Typography>
          </Stack>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Child's Personal Information
            </Typography>
            <Childinfo
              setChildData={setChildData}
              setPurok={setSelectedPurok}
              setGrowthData={setGrowthData}
              setScheduleData={setScheduleData}
              setNewAddress={setAddress}
              triggerErrorCheck={triggerErrorCheck}
            />
          </Paper>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Mother's Personal Information
            </Typography>
            <Motherinfo
              setMotherData={setMotherData}
              triggerErrorCheck={triggerErrorCheck}
            />
          </Paper>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="contained" color="info" xs={2}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Check />}
              xs={2}
              onClick={handleSave}
            >
              Save Record
            </Button>
          </Stack>
        </Stack>
      </Container>
      <GeneralModals
        open={openModal}
        onClose={handleCloseModal}
        title={<CheckCircle color="primary" sx={{ fontSize: 80 }} />}
        content={
          <Typography color="primary.darker">Successfully Registerd</Typography>
        }
        actions={
          <Button variant="contained" onClick={handleClose}>
            OK
          </Button>
        }
      />
    </Box>
  );
}
