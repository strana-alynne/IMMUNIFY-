import { Box, Container, Typography, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RefreshCcw } from "lucide-react";
import dayjs from "dayjs";
import { setMap } from "@/utils/supabase/dashboardmap";

export default function DashboardMap() {
  const [mapHtml, setMapHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const iframeRef = useRef(null);

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    async function loadMap() {
      try {
        setLoading(true);
        const startDateStr = startDate ? startDate.toISOString() : null;
        const endDateStr = endDate ? endDate.toISOString() : null;
        const mapData = await setMap(startDateStr, endDateStr);
        setMapHtml(mapData);
        setError(null);
      } catch (error) {
        console.error("Error loading map:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadMap();
  }, [startDate, endDate]);

  useEffect(() => {
    if (mapHtml && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.srcdoc = mapHtml;

      iframe.onload = () => {
        iframe.style.height = `${iframe.contentWindow.document.body.scrollHeight}px`;
      };
    }
  }, [mapHtml]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        marginTop: "20px",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            sx={{ width: 200 }}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            sx={{ width: 200 }}
            minDate={startDate}
            disabled={!startDate}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleReset}
            startIcon={<RefreshCcw size={16} />}
            size="medium"
            sx={{
              textTransform: "none",
              ml: 1,
              visibility: startDate || endDate ? "visible" : "hidden",
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </LocalizationProvider>

      <Container
        maxWidth="lg"
        sx={{ height: "600px", width: "100%", border: "1px solid #ccc" }}
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
