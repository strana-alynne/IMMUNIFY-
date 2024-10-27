"use client";
import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import Childinfo from "./childinfo";
import Motherinfo from "./motherinfo";
import { ArrowBack, Check } from "@mui/icons-material";
import { addChild, motherService } from "@/utils/supabase/api";
import { useRouter } from "next/navigation";
import { geocodeAddress, handleSchedules } from "@/utils/supabase/api";
import { toast, Toaster } from "sonner";

export default function AddChild() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    motherData: null,
    childData: {},
    purok: "",
    growth: {},
    scheduleData: {},
    address: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [triggerErrorCheck, setTriggerErrorCheck] = useState(false);

  const updateFormData = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const validateChildInfo = (childData, growth, purok, address) => {
    if (!childData.child_name?.trim()) return "Child name is required";
    if (!childData.gender) return "Gender is required";
    if (!childData.birthdate) return "Birthdate is required";
    if (!childData.address?.trim()) return "Address is required";
    if (!purok) return "Purok is required";
    if (!growth.height || growth.height <= 0) return "Valid height is required";
    if (!growth.weight || growth.weight <= 0) return "Valid weight is required";
    if (!address?.trim()) return "Complete address is required";
    return null;
  };

  const validateMotherInfo = (motherData) => {
    // If motherData is null or undefined, return error
    console.log("motherData", motherData);
    if (!motherData) return "Mother information is required";

    // Check based on whether it's a new or existing mother
    if (motherData.isExisting) {
      // For existing mother, just check if a mother was selected
      if (!motherData.mother_id)
        return "Please select a mother from the search results";
      return null;
    } else {
      // For new mother, validate all required fields
      if (!motherData.mother_name?.trim()) return "Mother's name is required";
      if (!motherData.mother_email?.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(motherData.mother_email))
        return "Invalid email format";
      if (!motherData.contact_number) return "Contact number is required";
      if (!/^[0-9]{11}$/.test(motherData.contact_number))
        return "Invalid contact number format";
      return null;
    }
  };

  const handleSave = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setTriggerErrorCheck(true);

      const { motherData, childData, purok, growth, scheduleData, address } =
        formData;

      // Validate child info
      const childError = validateChildInfo(childData, growth, purok, address);
      if (childError) {
        toast.error(childError);
        setIsSubmitting(false);
        return;
      }

      // Validate mother info
      const motherError = validateMotherInfo(motherData);
      if (motherError) {
        toast.error(motherError);
        setIsSubmitting(false);
        return;
      }

      const loadingToast = toast.loading("Saving record...");

      // 1. Geocode Address
      const geocodedAddress = await geocodeAddress(address);
      if (!geocodedAddress) {
        toast.dismiss(loadingToast);
        toast.error("Failed to validate address");
        setIsSubmitting(false);
        return;
      }

      let finalMotherData;

      // 2. Handle mother data based on isExisting flag
      if (motherData.isExisting) {
        // Use existing mother data directly
        console.log("mothederIDdhfjhf", motherData.mother_id);
        finalMotherData = motherData.mother_id;
      } else {
        // Create new mother account
        const motherResult = await motherService.createMotherAccount({
          mother_name: motherData.mother_name,
          mother_email: motherData.mother_email,
          contact_number: motherData.contact_number,
        });

        console.log("motherResult", motherResult);

        if (!motherResult || motherResult.error) {
          toast.dismiss(loadingToast);
          toast.error(
            motherResult?.error?.message || "Failed to create mother account"
          );
          setIsSubmitting(false);
          return;
        }
        finalMotherData = motherResult.motherData.mother_id;
      }

      console.log("finaleMotherData", finalMotherData);
      // 3. Add Child Record
      const childResult = await addChild(
        finalMotherData,
        childData,
        purok,
        growth,
        geocodedAddress
      );

      console.log("childResult", childResult.error);
      if (!childResult || childResult.error) {
        toast.dismiss(loadingToast);
        toast.error(
          childResult?.error?.message || "Failed to add child record"
        );
        setIsSubmitting(false);
        return;
      }

      const childId = localStorage.getItem("child_id");
      if (!childId) {
        toast.dismiss(loadingToast);
        toast.error("Failed to get child ID");
        setIsSubmitting(false);
        return;
      }

      await handleSchedules(scheduleData, childId);
      toast.dismiss(loadingToast);

      toast.success("Child Successfully Registered!", { duration: 3000 });

      setTimeout(() => {
        router.push(`./${childId}`);
      }, 3100);
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error(error.message || "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Toaster richColors position="top-right" />
      <Container fixed>
        <Stack spacing={4}>
          <Stack direction="column">
            <Stack direction="row" spacing={0.5}>
              <IconButton onClick={() => router.replace("/pages/ChildRecords")}>
                <ArrowBack
                  sx={{ fontSize: { lg: 40, md: 40, sm: 28 } }}
                  color="primary"
                />
              </IconButton>
              <FaceIcon
                sx={{ fontSize: { lg: 40, md: 40, sm: 28 } }}
                color="primary"
              />
              <Typography
                variant={isMobile || isTablet ? "h4" : "h2"}
                color="primary"
              >
                Child Records
              </Typography>
            </Stack>
            <Typography variant="p" color="secondary">
              + Add Child Record
            </Typography>
          </Stack>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Child's Personal Information
            </Typography>
            <Childinfo
              setChildData={(data) => updateFormData("childData", data)}
              setPurok={(data) => updateFormData("purok", data)}
              setGrowthData={(data) => updateFormData("growth", data)}
              setScheduleData={(data) => updateFormData("scheduleData", data)}
              setNewAddress={(data) => updateFormData("address", data)}
              triggerErrorCheck={triggerErrorCheck}
            />
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" color="primary.darker" sx={{ mb: 4 }}>
              Mother's Personal Information
            </Typography>
            <Motherinfo
              setMotherData={(data) => updateFormData("motherData", data)}
              triggerErrorCheck={triggerErrorCheck}
            />
          </Paper>

          <Stack direction="row-reverse" spacing={2}>
            <Button
              variant="contained"
              color="info"
              onClick={() => router.replace("/pages/ChildRecords")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Check />}
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Record"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
