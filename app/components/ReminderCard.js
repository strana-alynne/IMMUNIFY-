import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography, Stack } from "@mui/material";

export default function ReminderCard({ icon: Icon, title, description, time }) {
  return (
    <Card elevation={0}>
      <CardContent>
        <Stack direction="row" spacing={4}>
          <Stack direction="row" spacing={2}>
            <Icon color="primary" sx={{ fontSize: 40 }} />
            <Stack>
              <Typography variant="p" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="p2">{description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
