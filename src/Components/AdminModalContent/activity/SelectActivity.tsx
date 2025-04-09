import { Typography, FormControl, Autocomplete, TextField, LinearProgress, CircularProgress } from "@mui/material";
import { AdminModalContentProps } from "../../../Types/props";
import { ActivityInformation } from "../../../Types/types";
import { useEffect, useState } from "react";
import { getAllActivities } from "../../../utils/activityApi";
import "../AdminModalContent.scss";

const SelectActivity = ({ onApiInformationUpdate }: AdminModalContentProps) => {
  const [localActivityData, setLocalActivityData] = useState<ActivityInformation | null>(null);
  const [allActivities, setAllActivities] = useState<ActivityInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const activityResponse = await getAllActivities();
      setAllActivities(activityResponse);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="input-info-container">
      { isLoading ?
        <div className="selector-centering"> 
          <CircularProgress />
        </div>
      :
        <div className="selector-centering">
          <Typography variant="h5">Select an activity:</Typography>
          <FormControl className="select-autocomplete">
            <Autocomplete
              options={allActivities.sort((a, b) => a.activityName > b.activityName ? 1 : -1)}
              getOptionLabel={(option) => option.activityName}
              value={localActivityData}
              loading={isLoading}
              onChange={(_, newValue) => {
                // const activity = allActivities.find((activity) => activity.activityName === e.target.value);
                if (newValue) {
                  setLocalActivityData(newValue);
                  onApiInformationUpdate?.(newValue);
                } else {
                  setLocalActivityData(allActivities?.find((activity) => activity.activityName === localActivityData?.activityName) || {
                    activityName: '',
                    subsectionNames: [],
                    imagePath: '',
                    isIndividual: false,
                    isTeam: false
                  });
                }
              }} 
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select/type an activity"
                  variant="outlined"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.activityName}>
                  <Typography>{option.activityName}</Typography>
                </li>
              )}
            />
          </FormControl>
        </div>
      }
    </div>
  );
};

export default SelectActivity;
