import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography, Stack, Skeleton } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

export default function ChildRecordCard({
  title,
  header,
  description,
  color,
  loading,
  onClick,
  isActive = false,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        border: isActive ? `2px solid ${color}` : "none",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={4}>
          <Stack>
            {loading ? (
              <Skeleton variant="text" width="60%" />
            ) : (
              <Typography variant="h5" sx={{ paddingBottom: 1 }}>
                {title}
              </Typography>
            )}
            <Typography color={color} sx={{ fontSize: 16, fontWeight: "bold" }}>
              {header}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonth fontSize="small" sx={{ color: "grey" }} />
              <Typography variant="body2" color="grey">
                {description}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
