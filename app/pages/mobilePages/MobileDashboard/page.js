"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MobileSideBar from "@/app/components/MobileSideBar";
import AppBarMobile from "@/app/components/AppBarMobile";
import { useRouter } from "next/navigation";
import { motherChild } from "@/utils/supabase/api";
import { Face, Face2 } from "@mui/icons-material";
import { useUser } from "@/app/lib/UserContext";

// Chip color function
const getChipColor = (status) => {
  switch (status) {
    case "Complete":
      return {
        backgroundColor: "primary.light",
        color: "primary.dark",
        fontWeight: "bold",
      };
    case "Partially Completed":
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

export default function MobileDashboard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [childData, setChildData] = useState([]);
  const user = useUser();

  const SampleMotherId = user.user_metadata.mother_id;
  localStorage.setItem("motherId", SampleMotherId);
  const handleRowClick = (id) => {
    router.push(`/pages/mobilePages/MobileDashboard/${id}`);
    localStorage.setItem("childId", id);
  };

  useEffect(() => {
    async function loadChild() {
      try {
        const childInfo = await motherChild(SampleMotherId);
        setChildData(childInfo);
      } catch (error) {
        console.error(error);
      }
    }
    loadChild();
  }, []);

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

  return (
    <Box
      sx={{
        flexDirection: "column",
        alignItems: "stretch", // Stack children vertically // Center contents vertically
        width: "100%",
        maxWidth: "390px", // iPhone 12 Pro screen width
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      <AppBarMobile toggleDrawer={toggleDrawer} />
      <MobileSideBar open={open} toggleDrawer={toggleDrawer} />

      {/* Main Content */}

      <Container>
        <Typography variant="h4" color="primary" gutterBottom>
          Child Records
        </Typography>
        <Grid container spacing={2} display="flex">
          {childData.map((row) => (
            <Grid item xs={12} key={row.id}>
              <Card
                onClick={() => handleRowClick(row.child_id)}
                sx={{ cursor: "pointer", boxShadow: 3 }}
              >
                <CardContent>
                  <Stack
                    direction="column"
                    spacing={2}
                    alignItems="left"
                    display="flex"
                  >
                    <>
                      {row.gender === "Female" ? (
                        <Face2 color="secondary" style={{ fontSize: "40px" }} />
                      ) : (
                        <Face color="primary" style={{ fontSize: "40px" }} />
                      )}
                    </>
                    <Box>
                      <Typography variant="h6">{row.child_name}</Typography>
                      <Typography variant="body2">
                        <strong>Age: </strong>
                        {row.child_age} months
                      </Typography>
                      <Typography variant="body2">
                        <strong>Birthdate: </strong>
                        {row.birthdate}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="left">
                      <Chip
                        label={row.overallStatus}
                        sx={getChipColor(row.overallStatus)}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
