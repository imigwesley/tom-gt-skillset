import { Typography, TextField, FormControl, Autocomplete, ListItemText, Chip, AutocompleteChangeReason } from "@mui/material";
import { Box } from "@mui/system";
import { AdminModalContentProps } from "../../../Types/props";
import { MemberInformation, TeamInformation } from "../../../Types/types";
import { useState, SyntheticEvent, useEffect } from "react";
import { getAllUsersData } from "../../../utils/userApi";
import { isTeamInformation } from "../../../utils/Utils";
import '../AdminModalContent.scss';


const EditTeam = ({onApiInformationUpdate, userInput}: AdminModalContentProps) => {
  const [incorrectTeamNameError, setIncorrectTeamNameError] = useState(false);
  const [localTeamData, setLocalTeamData] = useState<TeamInformation>();
  const [allUsers, setAllUsers] = useState<MemberInformation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersResponse = await getAllUsersData();
      setAllUsers(usersResponse);
    }
    if (userInput && isTeamInformation(userInput)) {
      setLocalTeamData(userInput);
    }
    fetchData();
  }, []);

  const handleChangeTeamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      setIncorrectTeamNameError(false);
    }
    const temp: TeamInformation = {
      teamName: event.target.value,
      advisors: localTeamData?.advisors || [],
      membership: localTeamData?.membership || [],
      progress: localTeamData?.progress || []
    };
    setLocalTeamData(temp);
  };

  const handleTeamNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      const temp: TeamInformation = {
        teamName: event.target.value,
        advisors: localTeamData?.advisors || [],
        membership: localTeamData?.membership || [],
        progress: localTeamData?.progress || []
      };
      onApiInformationUpdate?.(temp);
    } else {
      setIncorrectTeamNameError(true);
    }
  }

  const handleChangeTeamAdvisors = (event: SyntheticEvent<Element, Event>,
    newValue: MemberInformation[],
    reason: AutocompleteChangeReason) => {
    const temp: TeamInformation = {
      teamName: localTeamData?.teamName || '',
      advisors: newValue.map((user) => user.identifiers.gtID),
      membership: localTeamData?.membership || [],
      progress: localTeamData?.progress || []
    };
    setLocalTeamData(temp);
    onApiInformationUpdate?.(temp);
  };

  const handleChangeTeamMembership = (event: SyntheticEvent<Element, Event>,
    newValue: MemberInformation[],
    reason: AutocompleteChangeReason) => {
    const temp: TeamInformation = {
      teamName: localTeamData?.teamName || '',
      advisors: localTeamData?.advisors || [],
      membership: newValue.map((user) => user.identifiers.gtID),
      progress: localTeamData?.progress || []
    };
    setLocalTeamData(temp);
    onApiInformationUpdate?.(temp);
  };

  return (
    <div className='input-info-container'>
      <Typography variant='h4'>Edit Team Information</Typography>
      <div className='input-info-section'>
        <Typography>Team Name*:</Typography>
        <TextField 
            fullWidth 
            value={localTeamData?.teamName} 
            onChange={handleChangeTeamName} 
            onBlur={handleTeamNameBlur}
            className='input-box'
            error={incorrectTeamNameError}
            helperText={incorrectTeamNameError ? 'Team name is required' : ''}
          />
        </div>
        <div className='input-info-section'>
          <Typography>Team Members*:</Typography>
          <FormControl fullWidth className='input-box'>
            <Autocomplete
              multiple
              options={allUsers}
              value={allUsers.filter((user) => localTeamData?.membership.includes(user.identifiers.gtID))}
              onChange={handleChangeTeamMembership}
              disableCloseOnSelect
              // PaperComponent={(props) => <StyledPaper {...props} />}
              getOptionLabel={(option) => option.identifiers.name}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder={localTeamData?.membership.length === 0 ? "None Selected" : ''} />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.identifiers.gtID}>
                  <ListItemText primary={option.identifiers.name} />
                </li>
              )}
              renderTags={(selected) =>
                selected.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    None Selected
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((user) => (
                      <div />
                      // <Chip key={user.identifiers.gtID} label={usersGTidMap[user.identifiers.gtID] || user.identifiers.gtID} />
                    ))}
                  </Box>
                )
              }
            />
          </FormControl>
        </div>
        <div className='input-info-section'>
          <Typography>Team Advisors*:</Typography>
          <FormControl fullWidth className='input-box'>
            <Autocomplete
              multiple
              options={allUsers}
              value={allUsers.filter((user) => localTeamData?.advisors.includes(user.identifiers.name))}
              onChange={handleChangeTeamAdvisors}
              disableCloseOnSelect
              // PaperComponent={(props) => <StyledPaper {...props} />}
              getOptionLabel={(option) => option.identifiers.name}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" placeholder={localTeamData?.advisors.length === 0 ? "None Selected" : ''} />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.identifiers.name}>
                  <ListItemText primary={option.identifiers.name} />
                </li>
              )}
              renderTags={(selected) =>
                selected.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    None Selected
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((user) => (
                      <div />
                      // <Chip key={user.identifiers.gtID} label={usersGTidMap[user.identifiers.gtID] || user.identifiers.gtID} />
                    ))}
                  </Box>
                )
              }
            />
          </FormControl>
        </div>
      </div>
  );
}

export default EditTeam;