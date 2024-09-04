import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import mobilepath from "../../mobilepath";
import { useRouter, usePathname } from "next/navigation";

export default function SwipeableTemporaryDrawer({ open, toggleDrawer }) {
  const path = mobilepath();
  const pathname = usePathname();
  const router = useRouter();

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
      <Box>
        <img
          src="/logo-wordmark-white.png"
          alt="IMMUNIFY logo"
          style={{ width: "200px", margin: "16px 0", marginLeft: "10px" }}
        />
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
