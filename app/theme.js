"use client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

export default function Theme({ children }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0e6b58",
        contrastText: "#f5fafb",
        light: "#CEF9EC",
        dark: "#14967F",
        darker: "#062D29",
        medium: "#000000",
      },
      secondary: {
        main: "#EE7423",
        contrastText: "#f5fafb",
        light: "#FDEDD7",
        dark: "#DF5917",
        medium: "#F2914",
      },
      error: {
        main: "#E94A4A",
        contrastText: "#f5fafb",
        light: "#FCCCCC",
        dark: "#D62C2C",
        medium: "#F37676",
      },
      info: {
        main: "#B0B0B0",
        contrastText: "#f5fafb",
      },
    },

    typography: {
      fontFamily: "Inter",
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 700,
      },
      h4: {
        fontSize: "1.75rem",
        fontWeight: 700,
      },
      h5: {
        fontSize: "1.5rem",
        fontWeight: 700,
      },
      h6: {
        fontSize: "1.25rem",
        fontWeight: 700,
      },

      p: {
        fontSize: "1.0rem",
        fontWeight: 500,
      },
      p2: {
        fontSize: "0.8rem",
        fontWeight: 500,
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#145B50", // Change this to your desired color
            color: "white", // Optional: change text color
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
