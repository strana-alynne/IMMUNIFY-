import Dashboard from "./pages/Dashboard/page";
import ChildRecords from "./pages/ChildRecords/page";
import DefaulterAnalysis from "./pages/DefaulterAnalysis/page";
import Inbox from "./pages/Inbox/page";
import Reminders from "./pages/Reminders/page";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FaceIcon from "@mui/icons-material/Face";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Appointments from "./pages/Appointments/page";
import VaccineInventory from "./pages/VaccineInventory/page";
import { Message, Notifications } from "@mui/icons-material";

const getPath = () => [
  { title: "General", kind: "header" },
  {
    id: 1,
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/pages/Dashboard",
  },
  {
    id: 2,
    title: "Vaccine Inventory",
    icon: <VaccinesIcon />,
    path: "/pages/VaccineInventory",
  },
  {
    id: 3,
    title: "Defaulter Analysis",
    icon: <AssessmentIcon />,
    path: "/pages/DefaulterAnalysis",
  },
  { title: "Immunization Records", kind: "header" },
  {
    id: 4,
    title: "Child Records",
    icon: <FaceIcon />,
    path: "/pages/ChildRecords",
  },
  { title: "Messaging", kind: "header" },
  {
    id: 5,
    title: "Appointments",
    icon: <CalendarMonthIcon />,
    path: "/pages/Appointments",
  },
  {
    id: 6,
    title: "Inbox",
    icon: <Message />,
    path: "/pages/Inbox",
  },
  {
    id: 7,
    title: "Reminders",
    icon: <Notifications />,
    path: "/pages/Reminders",
  },
];

export default getPath;
