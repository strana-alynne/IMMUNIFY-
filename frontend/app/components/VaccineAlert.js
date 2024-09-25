import React, { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { fetchVaccines } from "@/utils/supabase/api";

export default function VaccineAlert() {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && outOfStockVaccines.length > 0 && (
        <Alert severity="warning">
          <AlertTitle>No Vaccine Stocks</AlertTitle>
          The following vaccines are out of stock:{" "}
          <strong>{vaccineNames}</strong>.
        </Alert>
      )}
    </>
  );
}
