import { Box, Container, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { setMap } from "@/utils/supabase/api";

export default function Map() {
  const [mapHtml, setMapHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    async function loadMap() {
      try {
        const mapData = await setMap();
        setMapHtml(mapData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading map:", error);
        setError(error);
        setLoading(false);
      }
    }

    loadMap();
  }, []);

  useEffect(() => {
    if (mapHtml && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = mapHtml;

      iframe.onload = () => {
        // Adjust iframe height to match content
        iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
      };
    }
  }, [mapHtml]);

  return (
    <Box
      sx={{
        display: "flex",
        marginTop: "20px",
        height: "600px",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "100%",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        {loading ? (
          <Typography>Loading map...</Typography>
        ) : error ? (
          <Typography color="error">
            Error loading map: {error.message}
          </Typography>
        ) : (
          <iframe
            ref={iframeRef}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Folium Map"
          />
        )}
      </Container>
    </Box>
  );
}
