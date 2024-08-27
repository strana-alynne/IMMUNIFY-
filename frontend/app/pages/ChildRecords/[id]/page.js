"use client";
import React from "react";
import SideBar from "@/app/components/SideBar/page";
import { Box, Container, Typography, Stack, Chip, Paper, Button } from "@mui/material";
import { Face as FaceIcon, Face2, Edit, DeleteForever } from "@mui/icons-material";
import ChildCard from "./card";

const ChildId = ({ params }) => {
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
              {params.id}
            </Typography>
          </Stack>

          <Stack direction="row-reverse" spacing={2}>
            <Button variant="contained" color="error" startIcon={<DeleteForever />} xs={2}>
              Delete
            </Button>
            <Button variant="contained" color="primary" startIcon={<Edit />} xs={2}>
              Save Record
            </Button>
          </Stack>
          {/* INFORMATION */}
          <Paper sx={{ p: 4 }}>
            <Stack direction="row" spacing={8}>
              {/* CHILD DETAILS */}
              <Stack direction="row" spacing={2}>
                <Face2 sx={{ fontSize: 100 }} color="secondary" />
                <Stack spacing={0.5}>
                  <Typography variant="h5">Sarah Johnsons</Typography>
                  <Stack direction="row" spacing={0}>
                    <Stack>
                      <Typography variant="p">
                        <strong>Age:</strong> 4 years
                      </Typography>
                      <Typography variant="p">
                        <strong>Sex:</strong> Female
                      </Typography>
                      <Typography variant="p">
                        <strong>Birthdate:</strong> 10/15/2000
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="p">
                        <strong>Address:</strong> Dumoy Davao City, Philippines
                      </Typography>
                      <Typography variant="p">
                        <strong>Weight:</strong> 7 kg
                      </Typography>
                      <Typography variant="p">
                        <strong>Height:</strong> 64.4 inches
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant="p">
                        <strong>Mother's name:</strong> Maria Johnsons
                      </Typography>
                      <Typography variant="p">
                        <strong>Contact Number:</strong> 09123456789
                      </Typography>
                      <Typography variant="p">
                        <strong>Email Address:</strong> m.joined@gmail.com
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {/* IMMUNIZATION STATUS */}
              <Stack sx={{textAlign: "start"}}>
                <Typography variant="h6_regular">
                  Immunization Status
                </Typography>
                <Chip
                  label="Completed"
                  sx={{
                    backgroundColor: "primary.light",
                    color: "primary.dark",
                    fontWeight: "bold",
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
          {/* IMMUNIZATION CARD */}
            <ChildCard/>
        </Stack>
      </Container>
    </Box>
  );
};

export default ChildId;
