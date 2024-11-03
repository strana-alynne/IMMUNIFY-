"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";
import { motherService } from "@/utils/supabase/api";

export default function Motherinfo({ setMotherData, triggerErrorCheck }) {
  // States for form data
  const [formData, setFormData] = useState({
    mother_email: "",
    contact_number: "",
    mfirstname: "",
    mmiddlename: "",
    mlastname: "",
    mAge: "",
    msuffix: "",
    relationship: "",
  });

  const [isExistingMother, setIsExistingMother] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Relationship options
  const relationshipOptions = [
    "Mother",
    "Father",
    "Guardian",
    "Grandmother",
    "Grandfather",
    "Aunt",
    "Uncle",
    "Other",
  ];

  // Error states
  const [errors, setErrors] = useState({
    mother_email: "",
    contact_number: "",
    mfirstname: "",
    mmiddlename: "",
    mlastname: "",
    msuffix: "",
    relationship: "",
    mAge: "",
    search: "",
    general: "",
  });

  // Validation rules
  const validationRules = {
    mother_email: (value) => {
      if (!value.trim()) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
      return "";
    },
    contact_number: (value) => {
      if (!value) return "Contact number is required";
      if (!/^[0-9]{11}$/.test(value)) return "Invalid contact number";
      return "";
    },
    mfirstname: (value) =>
      value.trim() === "" ? "First name is required" : "",
    mmiddlename: (value) => "", // Optional field
    mAge: (value) => (value.trim() === "" ? "Age is required" : ""),
    mlastname: (value) => (value.trim() === "" ? "Last name is required" : ""),
    msuffix: (value) => "", // Optional field
    relationship: (value) =>
      value.trim() === "" ? "Relationship is required" : "",
  };

  // Update parent component with initial mother data
  useEffect(() => {
    updateParentMotherData();
  }, [formData, selectedMother, isExistingMother]);

  // Effect for error checking trigger
  useEffect(() => {
    if (!triggerErrorCheck) return;

    if (!isExistingMother) {
      validateAllFields();
    } else if (!selectedMother) {
      setErrors((prev) => ({
        ...prev,
        search: "Please select a guardian from the search results",
      }));
    }
  }, [triggerErrorCheck, isExistingMother, selectedMother]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isExistingMother && searchQuery) {
        handleSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isExistingMother]);

  const updateParentMotherData = () => {
    if (isExistingMother) {
      if (selectedMother) {
        setMotherData({
          mother_id: selectedMother.mother_id,
          mother_name: selectedMother.mother_name,
          mother_email: selectedMother.mother_email,
          contact_number: selectedMother.contact_number,
          relationship: selectedMother.relationship,
          isExisting: true,
        });
      } else {
        setMotherData(null);
      }
    } else {
      const fullName = [
        formData.mfirstname.trim(),
        formData.mmiddlename.trim(),
        formData.mlastname.trim(),
        formData.msuffix.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      if (formData.mother_email || formData.contact_number || fullName) {
        setMotherData({
          mother_name: fullName,
          mother_email: formData.mother_email,
          contact_number: formData.contact_number,
          relationship: formData.relationship,
          mother_age: formData.mAge,
          isExisting: false,
        });
      }
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((field) => {
      newErrors[field] = validationRules[field](formData[field]);
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some((error) => error);
  };

  // Handle search
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await motherService.searchMothers(query);

      if (error) throw error;

      setSearchResults(data || []);
      setErrors((prev) => ({ ...prev, search: "" }));
    } catch (error) {
      console.error("Search error:", error);
      setErrors((prev) => ({
        ...prev,
        search: "Failed to search guardians. Please try again.",
        general: error.message,
      }));
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field) => (event) => {
    const value =
      field === "contact_number"
        ? event.target.value.replace(/\D/g, "")
        : event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (triggerErrorCheck) {
      setErrors((prev) => ({
        ...prev,
        [field]: validationRules[field](value),
      }));
    }
  };

  // Handle mother type change
  const handleMotherTypeChange = (e) => {
    const isExisting = e.target.value === "true";
    setIsExistingMother(isExisting);

    // Reset states
    setSelectedMother(null);
    setSearchQuery("");
    setSearchResults([]);
    setErrors({});

    if (!isExisting) {
      setFormData({
        mother_email: "",
        contact_number: "",
        mfirstname: "",
        mmiddlename: "",
        mlastname: "",
        msuffix: "",
        relationship: "",
      });
    }
  };

  // Handle mother selection
  const handleMotherSelect = (event, mother) => {
    setSelectedMother(mother);
  };

  return (
    <Box>
      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RadioGroup
            row
            value={isExistingMother}
            onChange={handleMotherTypeChange}
          >
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="New Guardian"
            />
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Existing Guardian"
            />
          </RadioGroup>
        </Grid>

        {isExistingMother ? (
          <Grid item xs={12}>
            <Autocomplete
              options={searchResults}
              getOptionLabel={(option) =>
                `${option.mother_name} (${option.mother_email})`
              }
              onChange={handleMotherSelect}
              onInputChange={(_, newValue) => setSearchQuery(newValue)}
              value={selectedMother}
              loading={isSearching}
              loadingText="Searching..."
              noOptionsText={
                searchQuery.length < 2
                  ? "Type to search..."
                  : "No guardian found"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Guardian"
                  variant="outlined"
                  fullWidth
                  error={!!errors.search}
                  helperText={errors.search || "Search by name or email"}
                />
              )}
            />
            {selectedMother && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography>
                  Selected Guardian: {selectedMother.mother_name}
                </Typography>
                <Typography>Email: {selectedMother.mother_email}</Typography>
                <Typography>
                  Contact: {selectedMother.contact_number}
                </Typography>
                <Typography>
                  Relationship: {selectedMother.relationship}
                </Typography>
              </Alert>
            )}
          </Grid>
        ) : (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="p" color="darker">
                Email Address
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-email"
                label="e.g. name@email.com"
                type="email"
                value={formData.mother_email}
                onChange={handleInputChange("mother_email")}
                error={!!errors.mother_email}
                helperText={errors.mother_email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="p" color="darker">
                Contact Number
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-contact"
                label="e.g. 09123456789"
                name="contact_number"
                type="tel"
                inputProps={{
                  maxLength: 11,
                  pattern: "[0-9]*",
                }}
                value={formData.contact_number}
                onChange={handleInputChange("contact_number")}
                error={!!errors.contact_number}
                helperText={errors.contact_number}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="p" color="darker">
                First Name
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-firstname"
                label="First Name"
                name="firstname"
                value={formData.mfirstname}
                onChange={handleInputChange("mfirstname")}
                error={!!errors.mfirstname}
                helperText={errors.mfirstname}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <Typography variant="p" color="darker">
                M.I.
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-middlename"
                label="M.I."
                name="middlename"
                value={formData.mmiddlename}
                onChange={handleInputChange("mmiddlename")}
                error={!!errors.mmiddlename}
                helperText={errors.mmiddlename}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="p" color="darker">
                Last Name
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-lastname"
                label="Last Name"
                name="lastname"
                value={formData.mlastname}
                onChange={handleInputChange("mlastname")}
                error={!!errors.mlastname}
                helperText={errors.mlastname}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="p" color="darker">
                Suffix
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-suffix"
                label="e.g., Jr., Sr., III"
                name="suffix"
                value={formData.msuffix}
                onChange={handleInputChange("msuffix")}
                error={!!errors.msuffix}
                helperText={errors.msuffix}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="p" color="darker">
                Age
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                id="mother-lastname"
                label="Age"
                name="age"
                value={formData.mAge}
                onChange={handleInputChange("mAge")}
                error={!!errors.mAge}
                helperText={errors.mAge}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="p" color="darker">
                Relationship
              </Typography>
              <TextField
                select
                variant="outlined"
                fullWidth
                id="mother-relationship"
                label="Relationship"
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange("relationship")}
                error={!!errors.relationship}
                helperText={errors.relationship}
              >
                {relationshipOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
