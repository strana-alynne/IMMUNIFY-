import React from "react";
import { Stack, Typography, Grid, Chip } from "@mui/material";
import { Face2, Face } from "@mui/icons-material";

const ChildInfoSection = ({ childData, childStatus }) => {
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

  return (
    <Stack spacing={2}>
      {/* First section with child's basic info and status */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          {childData.gender === "Female" ? (
            <Face2 sx={{ fontSize: 48 }} color="secondary" />
          ) : (
            <Face sx={{ fontSize: 48 }} color="primary" />
          )}
          <Stack direction="column">
            <Typography variant="h5">{childData.child_name}</Typography>
            <Typography variant="p"> Child ID: {childData.child_id}</Typography>
          </Stack>
        </Stack>
        <Stack sx={{ textAlign: "start" }}>
          <Typography variant="h6_regular">Immunization Status</Typography>
          <Chip label={childStatus} sx={getChipColor(childStatus)} />
        </Stack>
      </Stack>

      {/* Second section with detailed information */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography variant="p">
              <strong>Age: </strong> {childData.child_age} years
            </Typography>
            <Typography variant="p">
              <strong>Sex: </strong> {childData.gender}
            </Typography>
            <Typography variant="p">
              <strong>Birthdate: </strong> {childData.birthdate}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography variant="p">
              <strong>Address: </strong> {childData.address}
            </Typography>
            <Typography variant="p">
              <strong>Facility Name: </strong> {childData.Purok.purok_name}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1}>
            <Typography variant="p">
              <strong>Guardian's Name: </strong> {childData.Mother.mother_name}
            </Typography>
            <Typography variant="p">
              <strong>Contact Number: </strong>{" "}
              {childData.Mother.contact_number}
            </Typography>
            <Typography variant="p">
              <strong>Email Address: </strong> {childData.Mother.mother_email}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ChildInfoSection;
