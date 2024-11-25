import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";

export default function AppBarMobile({ toggleDrawer }) {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: {
            xs: "48px", // Reduce height on mobile
            sm: "56px", // Default height for larger screens
          },
          px: 1, // Reduce horizontal padding
        }}
      >
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon color="primary" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <img
          src="/logo.svg"
          alt="IMMUNIFY logo"
          style={{
            width: "40px",
            margin: "16px 0",
          }}
        />
      </Toolbar>
    </AppBar>
  );
}
