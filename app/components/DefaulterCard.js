import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Stack, Typography } from "@mui/material";
import { EventBusy } from "@mui/icons-material";

export default function DefaulterCard({ title, description }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2}>
          <Stack spacing={0.5}>
            <Stack
              direction="row"
              justifyContent="left"
              alignItems="center"
              spacing={2}
            >
              <EventBusy color="error" sx={{ fontSize: 32 }} />
              <Typography variant="h4">{description}</Typography>
            </Stack>
            <Typography variant="p">
              <strong>Purok:</strong> {title}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
