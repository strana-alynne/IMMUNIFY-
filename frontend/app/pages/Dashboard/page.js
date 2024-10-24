"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DashBoardCard from "@/app/components/DashBoardCard";
import ReminderCard from "@/app/components/ReminderCard";
import { Group, Face, EventBusy, NewReleases, Chat } from "@mui/icons-material";
import Map from "@/app/components/Map";
import { createClient } from "@/utils/supabase/client";
import VaccineAlert from "@/app/components/VaccineAlert";
import { countMissedChildren, totalChildren } from "@/utils/supabase/api";
import RecordsLineChart from "@/app/components/RecordsLineChart";

export default function Dashboard() {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [motherNames, setMotherNames] = useState({});
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalDefaulters, setTotalDefaulters] = useState();
  const [total, setTotal] = useState();
  const supabase = createClient();

  useEffect(() => {
    async function loadChild() {
      try {
        const totalDef = await countMissedChildren();
        const totalChild = await totalChildren();
        console.log("totalDef", totalDef);
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
        console.log("user", user.user_metadata.role);
        setUser(user.user_metadata.role);
        fetchConversations(user.user_metadata.role);
      }
    };
    fetchUserAndConversations();
  }, []);

  const fetchConversations = async (user_id) => {
    console.log("fetching conversations", user_id);
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

    console.log("conversations", conversations);
    const conversationsList = Object.values(conversations);
    setConversations(conversationsList);

    // Fetch mother names for all recipients
    conversationsList.forEach(async (conversation) => {
      const recipientId = conversation.id;
      console.log("recipientId", recipientId);
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
        <Stack spacing={4}>
          <Stack direction="row" spacing={0.5}>
            <DashboardIcon
              sx={{ fontSize: { xs: 30, sm: 40 } }}
              color="primary"
            />
            <Typography variant={isMobile ? "h4" : "h2"} color="primary">
              Dashboard
            </Typography>
          </Stack>
        </Stack>
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
            <Map />
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
                Appointments
                <Box
                  spacing={2}
                  sx={{
                    maxHeight: "400px", // Adjust the height as needed
                    overflow: "auto",
                  }}
                >
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
                  <ReminderCard
                    icon={NewReleases}
                    title="Vaccine Schedule"
                    description="This is to remind you that your baby Angelo is ..."
                    time="3hr"
                  />
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
