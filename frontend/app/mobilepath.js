import MobileDashboard from "./mobilePages/MobileDashboard/page";
import AppointmentPage from "./mobilePages/MobileAppointments/page";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReminderPage from "./mobilePages/MobileReminder/page";
import { Notifications, InboxRounded } from "@mui/icons-material";
import InboxPage from "./mobilePages/MobileInbox/page";

const mobilepath = () => [
  {
    id: 1,
    label: "Dashboard",
    img: <DashboardIcon />,
    component: <MobileDashboard />,
    path: "/mobilePages/MobileDashboard",
  },
  {
    id: 2,
    label: "Appointments",
    img: <CalendarMonthIcon />,
    component: <AppointmentPage />,
    path: "/mobilePages/MobileAppointments",
  },
  {
    id: 3,
    label: "Reminders",
    img: <Notifications />,
    component: <ReminderPage />,
    path: "/mobilePages/MobileReminder",
  },
  {
    id: 4,
    label: "Inbox",
    img: <InboxRounded />,
    component: <InboxPage />,
    path: "/mobilePages/MobileInbox",
  },
];

export default mobilepath;
