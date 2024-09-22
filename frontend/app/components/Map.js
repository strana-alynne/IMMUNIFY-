import { Box, Container, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export default function Map() {
  const [mapHtml, setMapHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch(
          "https://immunify-dbscan.onrender.com/map_test"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const mapData = await response.text();
        setMapHtml(mapData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "100px",
      }}
    >
      <Container fixed sx={{ backgroundColor: "black" }}>
        {loading ? (
          <Typography color="white">Loading map...</Typography>
        ) : error ? (
          <Typography color="error">
            Error loading map: {error.message}
          </Typography>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: mapHtml }}
            style={{ width: "100%", height: "600px" }}
          />
        )}
      </Container>
    </Box>
  );
}
