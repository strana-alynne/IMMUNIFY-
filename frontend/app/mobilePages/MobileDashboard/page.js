"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack, IconButton,
  Chip,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppBarMobile from "@/app/components/AppBarMobile";
import { useRouter } from "next/navigation";
import MobileSideBar from "@/app/components/MobileSideBar/page";

// Dummy data function
function createData(name, age, bday, purok, mother, contact, status, id) {
  return { name, age, bday, purok, mother, contact, status, id };
}

// Chip color function
const getChipColor = (status) => {
  switch (status) {
    case "Completed":
      return { backgroundColor: "primary.light", color: "primary.dark" };
    case "Partial":
      return { backgroundColor: "secondary.light", color: "secondary.dark" };
    case "Missed Schedule":
      return { backgroundColor: "error.light", color: "error.dark" };
    default:
      return "default";
  }
};

// Sample Data
const rows = [
  createData(
    "Sarah Johnson",
    "12 months",
    "12/24/2023",
    "Farland",
    "Maria Johnson",
    "09564356754",
    "Completed",
    1
  ),
  createData(
    "John Doe",
    "11 months",
    "11/15/2023",
    "Country Homes",
    "Jane Doe",
    "09564356754",
    "Partial",
    2
  ),
  createData(
    "Emily Smith",
    "10 months",
    "10/05/2023",
    "Greenland",
    "Anna Smith",
    "09564356754",
    "Missed Schedule",
    3
  ),
];

export default function MobileDashboard() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleRowClick = () => {
    router.push(`/mobilePages/MobileDashboard/01`);
  };

  const handleEdit = (id) => {
    router.replace(`/pages/ChildRecords/EditChild/${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete functionality here
    console.log(`Delete record with ID: ${id}`);
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

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        maxWidth: "390px", // iPhone 12 Pro screen width
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        padding: "16px",
      }}
    >
      {/* Main Content */}
      <Box>
        {/* Top Bar */}
        <AppBarMobile toggleDrawer={toggleDrawer} />
        <MobileSideBar open={open} toggleDrawer={toggleDrawer} />

        {/* Child Records */}
        <Typography variant="h4" color="primary" gutterBottom marginLeft={6}>
          Child Records
        </Typography>

        <Container>
          <Grid container spacing={2}>
            {rows.map((row) => (
              <Grid item xs={12} key={row.id}>
                <Card
                  onClick={() => handleRowClick(row.id)}
                  sx={{ cursor: "pointer", boxShadow: 3 }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>{row.name[0]}</Avatar>
                      <Box>
                        <Typography variant="h6">{row.name}</Typography>
                        <Typography variant="body2">{row.age}</Typography>
                        <Typography variant="body2">{row.bday}</Typography>
                        <Typography variant="body2">{row.purok}</Typography>
                        <Typography variant="body2">
                          Mother: {row.mother}
                        </Typography>
                        <Typography variant="body2">
                          Contact Number: {row.contact}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center" }}>
                    <Chip label={row.status} sx={getChipColor(row.status)} />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row.id);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(row.id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
