"use client";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Face as FaceIcon,
  Face2,
  Edit,
  DeleteForever,
  Face3,
  Face,
  ArrowBack,
} from "@mui/icons-material";
import ChildCard from "./card";
import { fetchChild } from "@/utils/supabase/api";
import { useRouter } from "next/navigation";

const ChildId = ({ params }) => {
  const [childData, setChildData] = useState([]);
  const [childStatus, setChildStatus] = useState([]);
  const router = useRouter();

  const getChipColor = (status) => {
    switch (status) {
      case "Completed":
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
          <ChildCard />
        </Stack>
      </Container>
    </Box>
  );
};

export default ChildId;
