import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography, Stack } from "@mui/material";

export default function MessagesCard({ icon: Icon, title, description, time }) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4}>
          <Stack direction="row" spacing={2}>
            <Icon color="primary" sx={{ fontSize: 50 }} />
            <Stack>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="p2">{description}</Typography>
            </Stack>
          </Stack>
          <Typography variant="p"> {time}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
