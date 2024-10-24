import React from "react";
import { Box, Container, Stack, Paper, Skeleton, Grid } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const ChildRecordSkeleton = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Container fixed>
        <Stack spacing={4}>
          {/* Header Section */}
          <Stack direction="column">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />{" "}
              {/* Back button */}
              <Skeleton variant="circular" width={40} height={40} />{" "}
              {/* Face icon */}
              <Skeleton variant="text" width={200} height={40} /> {/* Title */}
            </Stack>
            <Skeleton variant="text" width={120} /> {/* Child ID */}
          </Stack>

          {/* Edit Buttons */}
          <Stack direction="row-reverse" spacing={2}>
            <Skeleton variant="rounded" width={150} height={36} />
            <Skeleton variant="rounded" width={180} height={36} />
          </Stack>

          {/* Child Info Paper */}
          <Paper sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {/* Child Details */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="65%" />
                </Stack>
              </Grid>
              {/* Status Section */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2} alignItems="flex-end">
                  <Skeleton variant="rounded" width={120} height={32} />
                  <Skeleton variant="text" width="40%" />
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Mother's Information Accordion */}
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="rounded" height={60} />
          </Paper>

          {/* Vaccine Alert */}
          <Skeleton variant="rounded" height={80} />

          {/* Form Section */}
          <Paper elevation={0}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Skeleton variant="rounded" height={56} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Skeleton variant="rounded" height={56} />
              </Grid>
              <Grid item xs={2}>
                <Skeleton
                  variant="rounded"
                  width={120}
                  height={36}
                  sx={{ mt: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Schedule Cards */}
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={120} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default ChildRecordSkeleton;
