"use client";
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashBoardCard from "@/app/components/DashBoardCard";
import ReminderCard from "@/app/components/ReminderCard";
import {
  Group,
  Face,
  EventBusy,
  NewReleases,
  Chat,
  Campaign,
} from "@mui/icons-material";
import Map from "@/app/components/Map";
import DashboardMap from "@/app/components/Dashboard_Map";
import { createClient } from "@/utils/supabase/client";
import VaccineAlert from "@/app/components/VaccineAlert";
import { countMissedChildren, totalChildren } from "@/utils/supabase/api";
import RecordsLineChart from "@/app/components/RecordsLineChart";
import { fetchReminders } from "@/utils/supabase/supabaseClient";

export default function Dashboard() {
  const theme = useTheme();
  const [filteredReminders, setFilteredReminders] = useState([]);
  const [user, setUser] = useState(null);
  const [motherNames, setMotherNames] = useState({});
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalDefaulters, setTotalDefaulters] = useState();
  const [total, setTotal] = useState();
  const supabase = createClient();

  useEffect(() => {
    const getReminders = async () => {
      const response = await fetchReminders();
      if (response.success) {
        setFilteredReminders(response.data); // Initialize filtered reminders
      } else {
        console.error("Failed to fetch reminders:", response.error);
        setReminders([]);
        setFilteredReminders([]);
      }
    };
    getReminders();

    async function loadChild() {
      try {
        const totalDef = await countMissedChildren();
        const totalChild = await totalChildren();
        setTotalDefaulters(totalDef);
        setTotal(totalChild);
      } catch (error) {
        console.error(error);
      }
    }
    loadChild();
  }, []);

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        fetchConversations(user.user_metadata.role);
      }
    };
    fetchUserAndConversations();
  }, []);

  const fetchConversations = async (user_id) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user_id}, recipient_id.eq.${user_id}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error.message);
      throw error;
    }

    const conversations = {};
    data.forEach((message) => {
      const person_id =
        message.sender_id === user_id
          ? message.recipient_id
          : message.sender_id;
      if (!conversations[person_id]) {
        conversations[person_id] = {
          id: person_id,
          messages: [],
        };
      }
      conversations[person_id].messages.push(message);
    });
    const conversationsList = Object.values(conversations);
    setConversations(conversationsList);

    // Fetch mother names for all recipients
    conversationsList.forEach(async (conversation) => {
      const recipientId = conversation.id;
      await fetchMotherName(recipientId);
    });
  };

  const fetchMotherName = async (motherId) => {
    const { data, error } = await supabase
      .from("Mother")
      .select("mother_name")
      .eq("mother_id", motherId)
      .single();

    if (data) {
      setMotherNames((prev) => ({
        ...prev,
        [motherId]: data.mother_name,
      }));
    } else if (error) {
      console.error("Error fetching mother name:", error);
      setMotherNames((prev) => ({
        ...prev,
        [motherId]: "Unknown Mother",
      }));
    }
  };

  return (
    <Box display="flex">
      <Container fixed>
        <div style={{ paddingBottom: 20 }}>
          <VaccineAlert />
        </div>
        {/* Population Cards */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={Group}
              title="20,373"
              description="Population as 2024"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={Face}
              title={total}
              description="Number of Babies"
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <DashBoardCard
              icon={EventBusy}
              title={totalDefaulters}
              description="Number of Defaulter"
              color="error"
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={{
            xs: 0,
            sm: 2,
            md: 3,
            lg: 4,
          }}
        >
          <Grid item xs={12} sm={12} md={8} lg={8} marginTop={5}>
            <Typography variant="h5" color="primary" marginBottom={2}>
              DEFAULTER ANALYSIS
            </Typography>
            <DashboardMap />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            direction="column"
            marginTop={5}
          >
            {/* Appointments and Messages Section */}
            <Grid item spacing={4}>
              <Typography variant="h6" color="primary">
                Reminders
                <Box
                  spacing={2}
                  sx={{
                    maxHeight: "400px", // Adjust the height as needed
                    overflow: "auto",
                  }}
                >
                  {Array.isArray(filteredReminders) &&
                    filteredReminders.map((reminder) => (
                      <ReminderCard
                        icon={
                          reminder.reminder_type === "Announcement"
                            ? NewReleases
                            : Campaign
                        }
                        title={reminder.title}
                        description={reminder.description}
                        time={new Date(reminder.created_at).toLocaleString()}
                      />
                    ))}
                </Box>
              </Typography>
            </Grid>
            <Grid item spacing={2}>
              <Typography variant="h6" color="primary">
                Messages
              </Typography>
              <Box
                spacing={2}
                sx={{
                  maxHeight: "400px", // Adjust the height as needed
                  overflow: "auto",
                }}
              >
                {conversations.map((message) => {
                  const recipientId = message.id;
                  const motherName = motherNames[recipientId] || "Loading...";

                  return (
                    <ReminderCard
                      icon={Chat}
                      title={motherName}
                      description={message.messages[0].content}
                      time="3hr"
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={12} lg={12} marginTop={5}>
            <RecordsLineChart />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
