"use client";
import React, { useState } from "react";
import SideBar from "@/app/components/SideBar/page";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Childinfo from "./childinfo";
import Motherinfo from "./motherinfo";
import { Check, CheckCircle } from "@mui/icons-material";
import { addChild } from "@/utils/supabase/api";
import GeneralModals from "@/app/components/Modals/Modals";
import { useRouter } from "next/navigation";

export default function AddChild() {
  const router = useRouter();
  const [motherData, setMotherData] = useState({});
  const [childData, setChildData] = useState({});
  const [purok, setSelectedPurok] = useState("");
  const [growth, setGrowthData] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleSave = async () => {
    //await addChild(motherData, childData, purok, growth);
    setOpenModal(true);
  };

  const handleClose = () => {
    router.push(`./01`);
  };
  return (
    <Box sx={{ display: "flex", marginTop: "50px" }}>
      <SideBar />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <FaceIcon sx={{ fontSize: 40 }} color="primary" />
              <Typography variant="h2" color="primary">
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
            />
          </Paper>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Mother's Personal Information
            </Typography>
            <Motherinfo setMotherData={setMotherData} />
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
        content={<Typography>Successfully Registerd</Typography>}
        actions={
          <Button variant="contained" onClick={handleClose}>
            OK
          </Button>
        }
      />
    </Box>
  );
}
