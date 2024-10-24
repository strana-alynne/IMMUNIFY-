import DashboardIcon from "@mui/icons-material/Dashboard";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FaceIcon from "@mui/icons-material/Face";

const getPath = (role = "NURSE") => [
  { title: "General", kind: "header" },
  {
    id: 1,
    title: "Dashboard",
    icon: <DashboardIcon />,
    path: "/pages/Dashboard",
  },
  ...(role === "NURSE"
    ? [
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
      ]
    : []),
  { title: "Immunization Records", kind: "header" },
  {
    id: 4,
    title: "Child Records",
    icon: <FaceIcon />,
    path: "/pages/ChildRecords",
  },
  ...(role !== "NURSE"
    ? [
        { title: "Messaging", kind: "header" },
        {
          id: 5,
          title: "Inbox",
          icon: <Message />,
          path: "/pages/Inbox",
        },
        {
          id: 6,
          title: "Reminders",
          icon: <Notifications />,
          path: "/pages/Reminders",
        },
      ]
    : []),
];

export default getPath;
