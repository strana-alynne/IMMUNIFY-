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

const mobilepath = () => [
  {
    id: 1,
    label: "Dashboard",
    img: <DashboardIcon />,
    component: <Dashboard />,
    path: "/pages/Dashboard",
  },
  {
    id: 2,
    label: "Vaccine Inventory",
    img: <VaccinesIcon />,
    component: <VaccineInventory />,
    path: "/pages/VaccineInventory",
  },
  {
    id: 3,
    label: "Defaulter Analysis",
    img: <AssessmentIcon />,
    component: <DefaulterAnalysis />,
    path: "/pages/DefaulterAnalysis",
  },
  {
    id: 4,
    label: "Child Records",
    img: <FaceIcon />,
    component: <ChildRecords />,
    path: "/pages/ChildRecords",
  },
  {
    id: 5,
    label: "Appointments",
    img: <CalendarMonthIcon />,
    component: <Appointments />,
    path: "/pages/Appointments",
  },
  {
    id: 6,
    label: "Inbox",
    img: <Message />,
    component: <Inbox />,
    path: "/pages/Inbox",
  },
  {
    id: 7,
    label: "Reminders",
    img: <Notifications />,
    component: <Reminders />,
    path: "/pages/Reminders",
  },
];

export default mobilepath;
