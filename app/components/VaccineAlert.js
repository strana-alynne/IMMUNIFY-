import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchVaccines } from "@/utils/supabase/api";

export default function VaccineAlert() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(true); // State to control visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vaccineData = await fetchVaccines();
        setVaccines(vaccineData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const outOfStockVaccines = vaccines.filter(
    (vaccine) => vaccine.vaccine_quantity === 0
  );
  const vaccineNames = outOfStockVaccines
    .map((vaccine) => vaccine.Vaccine.vaccine_name)
    .join(", ");

  const handleClose = () => {
    setShowAlert(false); // Hide the alert when close button is clicked
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && showAlert && (
        <Alert
          severity="error"
          onClose={handleClose}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}
      {!loading && outOfStockVaccines.length > 0 && showAlert && (
        <Alert
          severity="warning"
          onClose={handleClose}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>No Vaccine Stocks</AlertTitle>
          The following vaccines are out of stock:{" "}
          <strong>{vaccineNames}</strong>.
        </Alert>
      )}
    </>
  );
}
