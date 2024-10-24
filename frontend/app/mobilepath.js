import MobileDashboard from "./pages/mobilePages/MobileDashboard/page";
import AppointmentPage from "./pages/mobilePages/MobileAppointments/page";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReminderPage from "./pages/mobilePages/MobileReminder/page";
import { Notifications, InboxRounded } from "@mui/icons-material";
import InboxPage from "./pages/mobilePages/MobileInbox/page";

const mobilepath = () => [
  {
    id: 1,
    label: "Dashboard",
    img: <DashboardIcon />,
    component: <MobileDashboard />,
    path: "/pages/mobilePages/MobileDashboard",
  },
  {
    id: 2,
    label: "Appointments",
    img: <CalendarMonthIcon />,
    component: <AppointmentPage />,
    path: "/pages/mobilePages/MobileAppointments",
  },
  {
    id: 3,
    label: "Reminders",
    img: <Notifications />,
    component: <ReminderPage />,
    path: "/pages/mobilePages/MobileReminder",
  },
  {
    id: 4,
    label: "Inbox",
    img: <InboxRounded />,
    component: <InboxPage />,
    path: "/pages/mobilePages/MobileInbox",
  },
];

export default mobilepath;
