import Dashboard from "./pages/Dashboard/page";
import ChildRecords from "./pages/ChildRecords/page";
import DefaulterAnalysis from "./pages/DefaulterAnalysis/page";
import Inbox from "./pages/Inbox/page";
import Reminders from "./pages/Reminders/page";
import VaccinInventory from "./pages/VaccineInventory/page";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FaceIcon from "@mui/icons-material/Face";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Appointments from "./pages/Appointments/page";

const getPath = () => [
  {
    id: 0,
    label: "Dashboard",
    img: <DashboardIcon />,
    component: <Dashboard />,
    path: "../pages/Dashboard",
  },
  {
    id: 1,
    label: "Vaccine Inventory",
    img: <VaccinesIcon />,
    component: <VaccinInventory />,
    path: "../pages/VaccineInventory",
  },
  {
    id: 2,
    label: "Defaulter Analysis",
    img: <AssessmentIcon />,
    component: <DefaulterAnalysis />,
    path: "../pages/DefaulterAnalysis",
  },
  {
    id: 3,
    label: "Child Records",
    img: <FaceIcon />,
    component: <ChildRecords />,
    path: "../pages/ChildRecords",
  },
  {
    id: 4,
    label: "Appointments",
    img: <CalendarMonthIcon />,
    component: <Appointments />,
    path: "../pages/Appointments",
  },
];

export default getPath;
