"use client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";

export default function Theme({ children }) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0e6b58",
        contrastText: "#f5fafb",
      },
      secondary: {
        main: "#EE7423",
        contrastText: "#f5fafb",
      },
      error: {
        main: "#E94A4A",
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
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
