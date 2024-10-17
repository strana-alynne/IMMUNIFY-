"use client";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { redirect, useRouter } from "next/navigation";
import getPath from "@/app/path";
import { Logout } from "@mui/icons-material";
import { UserCircle } from "lucide-react";
import { Stack } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function SideBar({ children, user }) {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const path = getPath();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsClicked(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
      // Optionally, show an error message to the user
    } finally {
      setIsLoggingOut(false);
      setIsClicked(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Immunify Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Image
            src={open ? "/logo-wordmark-white.png" : "/logo-white.png"} // Change this path as needed
            alt="logo"
            width={open ? 180 : 40}
            height={open ? 180 : 40}
            // Adjust size for closed state if needed
          />

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon sx={{ color: "white" }} />
            ) : (
              <ChevronRightIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ p: 1 }}>
          {path.map((item, index) =>
            item.kind === "header" ? (
              <ListItem key={index} disablePadding>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ fontSize: 14 }}
                />
              </ListItem>
            ) : (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => router.push(`${item.path}`)}>
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  <Divider />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "#147162",
          }}
        >
          <List>
            <ListItem color="primary.light">
              <Box sx={{ bgcolor: "#EE7423", p: 0.5, borderRadius: 1, mr: 1 }}>
                <UserCircle fontSize={32} />
              </Box>
              <Stack sx={{ paddingRight: "4px" }}>
                <Typography sx={{ fontSize: 12, fontWeight: "600" }}>
                  {user.email}
                </Typography>
                <Typography sx={{ fontSize: 12 }}>
                  Brgy. Health Worker
                </Typography>
              </Stack>
              <ListItemButton
                onClick={handleLogout}
                onMouseLeave={() => setIsClicked(false)} // Reset click state on mouse leave
                sx={{
                  bgcolor: isClicked ? "#FF5722" : "transparent", // Change color on click
                  padding: "0px",
                  "&:hover": {
                    bgcolor: "#FF8A65",
                    padding: "0px", // Change color on hover
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", padding: "0px" }}>
                  {isLoggingOut ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <Logout />
                  )}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
