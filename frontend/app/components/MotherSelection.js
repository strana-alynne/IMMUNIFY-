import React from "react";
import {
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";

export default function MotherSelection({
  setMotherData,
  triggerErrorCheck,
  existingMother,
  setExistingMother,
}) {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMother, setSelectedMother] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search for existing mothers
  const searchMothers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data, error } = await supabase
      .from("Mother")
      .select("*")
      .or(`mother_name.ilike.%${query}%,mother_email.ilike.%${query}%`)
      .limit(5);

    if (error) {
      console.error("Error searching mothers:", error);
      return;
    }

    setSearchResults(data || []);
  };

  // Handle mother selection
  const handleMotherSelect = (event, mother) => {
    setSelectedMother(mother);
    if (mother) {
      setMotherData({
        mother_id: mother.mother_id,
        mother_name: mother.mother_name,
        mother_email: mother.mother_email,
        contact_number: mother.contact_number,
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" color="primary.darker" gutterBottom>
          Mother Registration Type
        </Typography>
        <RadioGroup
          value={existingMother}
          onChange={(e) => setExistingMother(e.target.value === "true")}
          row
        >
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="New Mother"
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Existing Mother"
          />
        </RadioGroup>
      </Grid>

      {existingMother ? (
        <Grid item xs={12}>
          <Autocomplete
            options={searchResults}
            getOptionLabel={(option) =>
              `${option.mother_name} (${option.mother_email})`
            }
            onChange={handleMotherSelect}
            onInputChange={(event, newValue) => {
              setSearchQuery(newValue);
              searchMothers(newValue);
            }}
            value={selectedMother}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Mother"
                variant="filled"
                fullWidth
                helperText="Search by name or email"
              />
            )}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}
