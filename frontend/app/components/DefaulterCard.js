import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Stack, Typography } from "@mui/material";
import { EventBusy } from "@mui/icons-material";

export default function DefaulterCard({ title, description }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4}>
          <Stack spacing={2}>
            <Typography variant="p">
              <strong>Purok:</strong> {title}
            </Typography>
            <Stack direction="row" justifyContent="center" spacing={2}>
              <EventBusy color="error" sx={{ fontSize: 50 }} />
              <Typography variant="h4">{description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
