"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import mobilepath from "../mobilepath";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgress, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "../lib/UserContext";

export default function MobileSideBar({ open, toggleDrawer }) {
  const path = mobilepath();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsClicked(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      localStorage.removeItem("child_id"); // Clear any other session data if applicable
      router.push("/pages/mobilePages/MobileLogIn");
    } catch (error) {
      console.error("Error signing out:", error.message);
      // Optionally, show an error message to the user
    } finally {
      setIsLoggingOut(false);
      setIsClicked(false);
    }
  };

  const handleNavigation = (path) => {
    router.replace(path);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ marginLeft: "10px", marginTop: "20px", marginBottom: "10px" }}>
        <img
          src="/logo-white.png"
          alt="IMMUNIFY logo"
          style={{ width: "50px" }}
        />
        <Box sx={{ paddingBottom: "10px" }}></Box>
        <Typography variant="h6" component="div">
          Hello, User!
        </Typography>
        <Typography sx={{ fontSize: 12 }} component="div">
          {user.email}
        </Typography>
      </Box>
      <Divider />

      <List>
        {path.map((text, index) => (
          <React.Fragment key={text.id}>
            <ListItem key={text.id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    text.path === pathname ? "#164B43" : "#145B50",
                }}
                onClick={() => handleNavigation(text.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {text.img}
                </ListItemIcon>
                <ListItemText
                  primary={text.label}
                  sx={{ opacity: open ? 1 : 0, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
            {index === 0 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0px",
        }}
      >
        <List>
          <ListItemButton
            onClick={handleLogout}
            // onClick={handleLogout}
            onMouseLeave={() => setIsClicked(false)} // Reset click state on mouse leave
            sx={{
              height: 48,
              bgcolor: isClicked ? "#FF5722" : "#FF8A65", // Change color on click
              paddingLeft: "12px",
              "&:hover": {
                bgcolor: "#FF8A65", // Change color on hover
              },
            }}
          >
            <ListItemText
              primary="Logout"
              sx={{ opacity: open ? 1 : 0, color: "white" }}
            />
            <ListItemIcon sx={{ color: "white", padding: "0px" }}>
              {isLoggingOut ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <Logout />
              )}
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      {list()}
    </SwipeableDrawer>
  );
}
