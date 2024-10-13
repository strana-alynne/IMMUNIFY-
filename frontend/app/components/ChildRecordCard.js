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
}) {
  return (
    <Card>
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
            <Stack direction="row">
              <CalendarMonth fontSize="16" sx={{ color: "grey" }} />
              <Typography variant="p2" color="grey">
                {description}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
