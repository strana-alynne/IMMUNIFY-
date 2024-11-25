import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Typography, Stack, Icon } from "@mui/material";

export default function DashBoardCard({
  icon: Icon,
  title,
  header,
  description,
  color,
}) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4}>
          <Stack direction="row" spacing={2}>
            <Icon color={color} sx={{ fontSize: 50 }} />
            <Stack>
              <Typography variant="h6">{header}</Typography>
              <Typography variant="h6">{title}</Typography>
              <Typography variant="p2">{description}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
