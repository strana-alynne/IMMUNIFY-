"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/navigation";
import ChildRecordsIcon from "@mui/icons-material/ChildCare";
import AppointmentIcon from "@mui/icons-material/Event";
import InboxIcon from "@mui/icons-material/Inbox";
import ReminderIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

// Define the width of the drawer
const drawerWidth = 240;

// Styles for the open drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

// Styles for the closed drawer
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// Header styles for the drawer
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Styled drawer
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// Sidebar component
export default function SideBar() {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  // Toggle the drawer open/close state
  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Navigate to a different path
  const handleNavigation = (path) => {
    router.replace(path);
  };

  // Handle log out
  const handleLogout = () => {
    // Implement your logout logic here, e.g., clearing user data and redirecting to login page
    router.replace("/login"); // Replace with the actual login page path
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <img
            src={open ? "/logo-wordmark-white.png" : "/logo-white.png"}
            alt="logo"
            width={open ? 180 : 40}
          />
          <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation("/pages/MobileDashboard")}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: "#145B50",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <ChildRecordsIcon />
              </ListItemIcon>
              <ListItemText
                primary="Child Record"
                sx={{ opacity: open ? 1 : 0, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation("/pages/Appointments")}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: "#145B50",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <AppointmentIcon />
              </ListItemIcon>
              <ListItemText
                primary="Appointments"
                sx={{ opacity: open ? 1 : 0, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation("/pages/Inbox")}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: "#145B50",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Inbox"
                sx={{ opacity: open ? 1 : 0, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation("/pages/Reminders")}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: "#145B50",
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <ReminderIcon />
              </ListItemIcon>
              <ListItemText
                primary="Reminders"
                sx={{ opacity: open ? 1 : 0, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ mt: "auto" }} />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: "#D32F2F", // Red color for logout button
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Log Out"
                sx={{ opacity: open ? 1 : 0, color: "white" }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
