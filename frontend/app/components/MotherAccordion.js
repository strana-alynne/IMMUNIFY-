import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Stack,
  IconButton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const MotherAccordion = ({ motherData }) => {
  return (
    <Accordion sx={{ mt: 2 }} elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="mother-content"
        id="mother-header"
      >
        <Typography variant="h6">Gaurdian's Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography>
                <strong>Name:</strong> {motherData.mother_name}
              </Typography>
              <Typography>
                <strong>Age:</strong> {motherData.mother_age}
              </Typography>
              <Typography>
                <strong>Contact:</strong> {motherData.contact_number}
              </Typography>
              <Typography>
                <strong>Email:</strong> {motherData.mother_email}
              </Typography>
              <Typography>
                <strong>Relationship:</strong> {motherData.relationship}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default MotherAccordion;
