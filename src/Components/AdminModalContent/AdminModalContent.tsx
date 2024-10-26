import { Autocomplete, AutocompleteChangeReason, Box, Button, Chip, FormControl, IconButton, ListItemText, MenuItem, Paper, Popper, Select, styled, TextField, Typography } from '@mui/material';
import './AdminModalContent.scss';
import { SyntheticEvent, useEffect, useState } from 'react';
import modulesSample from '../../SampleData/ModulesSample';
import membersSample from '../../SampleData/MembersSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import teamsSample from '../../SampleData/TeamsSample';
import Checkbox from '@mui/material/Checkbox';
import { AdminModalContentProps, ApiSendInformation, MemberInformation, ModalPages, ModuleInformation, NameGTidMap, SubsectionInformation, TeamInformation } from '../../Types/types';
import { Add, AddPhotoAlternate, DeleteOutline } from '@mui/icons-material';
import { validateEmailString } from '../../utils/Utils';


const AdminModalContent = ({ page, passedApiInformation, onApiInformationUpdate, onImageProvided }: AdminModalContentProps) => {
  
  // user input errors
  const [incorrectUserNameError, setIncorrectUserNameError] = useState(false);
  const [incorrectGTIDValueError, setIncorrectGTIDValueError] = useState(false);
  const [emailErrors, setEmailErrors] = useState<boolean[]>([false]);

  const [userSelected, setUserSelected] = useState<string>(); // used??
  const [teamSelected, setTeamSelected] = useState<string>(); // used??
  const [moduleSelected, setModuleSelected] = useState<string>(); // used??
  const [subsectionSelected, setSubsectionSelected] = useState<string>(); // used??
  const [usersGTidMap, setUsersGTidMap] = useState<NameGTidMap>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  // local data for editing in modal and sending to api
  const [localUserData, setLocalUserData] = useState<MemberInformation | null>({
    name: '',
    email: [''],
    gtID: '',
    teamMembership: [],
    teamsAdvising: [],
    role: '',
    isExec: false,
    moduleProgress: [{
      moduleName: '',
      percentComplete: 0.0,
      isAssigned: false,
      subsectionsComplete: []
    }]
  });
  const [localTeamData, setLocalTeamData] = useState<TeamInformation | null>({
    teamName: '',
    membership: [],
    advisors: []
  });
  const [localModuleData, setLocalModuleData] = useState<ModuleInformation | null>({
    moduleName: '',
    subsections: [],
    imageURL: ''
  })
  const [localSubsectionData, setLocalSubsectionData] = useState<SubsectionInformation | null>({
    subsectionName: '',
    subsectionHtml: ''
  })

  // all data from api
  const teamsData: TeamInformation[] = passedApiInformation.teams || [{
      teamName: '',
      membership: [],
      advisors: []
    }];
  const usersData: MemberInformation[] = passedApiInformation.users || [{
    name: '',
    email: [''],
    gtID: '',
    teamMembership: [],
    teamsAdvising: [],
    role: '',
    isExec: false,
    moduleProgress: [{
      moduleName: '',
      percentComplete: 0.0,
      isAssigned: false,
      subsectionsComplete: []
    }]
  }];
  const modulesData: ModuleInformation[] = passedApiInformation.modules || [{
    moduleName: '',
    subsections: [],
    imageURL: ''
  }];
  const subsectionsData: SubsectionInformation[] = passedApiInformation.subsections || [{
    subsectionName: '',
    subsectionHtml: ''
  }];

  useEffect(() => {
    console.log('here too, ', passedApiInformation);
    if (passedApiInformation.users) {
      setUsersGTidMap(passedApiInformation?.users.reduce((acc: {[key: string]: string}, member) => {
        acc[member.gtID] = member.name;
        return acc;
      }, {}));
    } else {
      console.warn('no users found. Gtid map cannot be set.')
    }
    
  }, [passedApiInformation])



  /////////////////////////////////////////// USER ACTIONS //////////////////////////////////////////////
  const handleUserNameBlur = (name: string) => {
    console.log('name on blur is', name);
    if (name === '') {
      setIncorrectUserNameError(true);
    }
  }

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _name = event.target.value;
    if (_name !== '') {
      setIncorrectUserNameError(false);
    }
    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: _name,
      email: localUserData?.email || [],
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
    };
    
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  };

  const handleChangeUserPrimaryEmail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!validateEmailString(event.target.value)) {
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[0] = false;
        return newErrors;
      });
    }

    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: [event.target.value, ...(localUserData?.email.slice(1) || [])], // Safe slicing
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
    };

    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  };

  const handleChangeUserOtherEmails = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!validateEmailString(event.target.value)) {
      emailErrors[index + 1] = false;
    }

    const newEmails = [...(localUserData?.email || [])];
    newEmails[index + 1] = event.target.value;

    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: newEmails,
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
    };

    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  };

  const handleDeleteOtherEmail = (index: number) => {
    let newEmails = [...(localUserData?.email || [])];
    console.log(newEmails);
    newEmails.splice(index + 1, 1);

    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: newEmails,
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
    };

    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleOpenNewEmailTextField = () => {
    setLocalUserData((prev) => {
      const newEmails = [...(prev?.email || []), ""]; // Safe fallback
      const updatedUserData: MemberInformation = {
        gtID: prev?.gtID || '',
        name: prev?.name || '',
        email: newEmails,
        teamMembership: prev?.teamMembership || [],
        teamsAdvising: prev?.teamsAdvising || [],
        role: prev?.role || '',
        isExec: prev?.isExec || false,
        moduleProgress: prev?.moduleProgress || [],
      };

      onApiInformationUpdate(updatedUserData);
      return updatedUserData;
    });
  };

  const handleEmailBlur = (email: string, index: number) => {
    const newErrors = [...emailErrors];
    const isValid = validateEmailString(email);
    console.log('is it valid? ', isValid)
    newErrors[index] = isValid;
    setEmailErrors(newErrors);
    
  }

  const handleChangeUserGtid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Check if the value is a valid number
    if (isNaN(Number(value))) {
      console.warn('nan');
      setIncorrectGTIDValueError(true);
    } else if (value.length === 9) {
      // This block is executed if the value is numeric and has the correct length
      setIncorrectGTIDValueError(false);
      
      const temp: MemberInformation = {
          gtID: value,
          name: localUserData?.name || '', // Default value if null
          email: localUserData?.email || [],
          teamMembership: localUserData?.teamMembership || [],
          teamsAdvising: localUserData?.teamsAdvising || [],
          role: localUserData?.role || '',
          isExec: localUserData?.isExec || false,
          moduleProgress: localUserData?.moduleProgress || [],
      };

      setLocalUserData(temp);
      onApiInformationUpdate(temp);
    } else {
      // Handle cases where the length is not 9 but it is a valid number
      const temp: MemberInformation = {
          gtID: value,
          name: localUserData?.name || '',
          email: localUserData?.email || [],
          teamMembership: localUserData?.teamMembership || [],
          teamsAdvising: localUserData?.teamsAdvising || [],
          role: localUserData?.role || '',
          isExec: localUserData?.isExec || false,
          moduleProgress: localUserData?.moduleProgress || [],
      };

      setLocalUserData(temp);
      onApiInformationUpdate(temp);
    }
  };



  const handleGtIDBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // console.log(event.target.value);
    if (event.target.value.length != 9) {
      setIncorrectGTIDValueError(true)
    } 
  }

  const handleChangeUserTeamMembership = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: localUserData?.email || [],
      teamMembership: event.target.value,
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
      };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleChangeUserTeamsAdvising = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: localUserData?.email || [],
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: event.target.value,
      role: localUserData?.role || '',
      isExec: localUserData?.isExec || false,
      moduleProgress: localUserData?.moduleProgress || [],
      };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleChangeUserRole = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: localUserData?.name || '',
      email: localUserData?.email || [],
      teamMembership: localUserData?.teamMembership || [],
      teamsAdvising: localUserData?.teamsAdvising || [],
      role: event.target.value,
      isExec: event.target.value !== 'Member',
      moduleProgress: [], // role is required, so set this here
      };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  ///////////////////////////// TEAM ACTIONS ////////////////////////////////////////////////////////////////////
  const handleChangeTeamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: TeamInformation = {
      teamName: event.target.value,
      advisors: localTeamData?.advisors || [],
      membership: localTeamData?.membership || [],
    };
    setLocalTeamData(temp);
    onApiInformationUpdate(temp);
  };

  const handleChangeTeamAdvisors = (event: SyntheticEvent<Element, Event>,
    newValue: MemberInformation[],
    reason: AutocompleteChangeReason) => {
    const temp: TeamInformation = {
      teamName: localTeamData?.teamName || '',
      advisors: newValue.map((user) => user.gtID),
      membership: localTeamData?.membership || [],
    };
    setLocalTeamData(temp);
    onApiInformationUpdate(temp);
  };

  const handleChangeTeamMembership = (event: SyntheticEvent<Element, Event>,
    newValue: MemberInformation[],
    reason: AutocompleteChangeReason) => {
    const temp: TeamInformation = {
      teamName: localTeamData?.teamName || '',
      advisors: localTeamData?.advisors || [],
      membership: newValue.map((user) => user.gtID),
    };
    setLocalTeamData(temp);
    onApiInformationUpdate(temp);
  };

  ////////////////////////// MODULE ACTIONS /////////////////////////////////////////////////////////

  const handleChangeModuleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: ModuleInformation = {
      moduleName: event.target.value,
      subsections: localModuleData?.subsections || [],
      imageURL: localModuleData?.imageURL || '',
    };
    setLocalModuleData(temp);
    onApiInformationUpdate(temp);
  }

  const handleChangeModuleSubsectionsSelection = (event: SyntheticEvent<Element, Event>,
    newValue: SubsectionInformation[],
    reason: AutocompleteChangeReason) => {
    const temp: ModuleInformation = {
      moduleName: localModuleData?.moduleName || '',
      subsections: newValue.map((subsection) => subsection.subsectionName),
      imageURL: localModuleData?.imageURL || '',
    };
    setLocalModuleData(temp);
    onApiInformationUpdate(temp);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageProvided(file); // TODO: will need to update the url based on what s3 says
    }
  };


  //////////////////////////////// SUBSECTION ACTIONS /////////////////////////////////////////////////////////
  const handleChangeSubsectionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: SubsectionInformation = {
      subsectionName: event.target.value,
      subsectionHtml: localSubsectionData?.subsectionHtml || '',
    };
    setLocalSubsectionData(temp);
    onApiInformationUpdate(temp);
  };

  const handleChangeSubsectionHtml = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: SubsectionInformation = {
      subsectionName: localSubsectionData?.subsectionName || '',
      subsectionHtml: event.target.value,
    };
    setLocalSubsectionData(temp);
    onApiInformationUpdate(temp);
  }

  const StyledPaper = styled(Paper)(({ theme }) => ({
    maxHeight: '200px', // Set your desired max height
    overflowY: 'auto',   // Enable vertical scrolling if needed
  }));


  return (
    <div className='input-info-container'>
      {page === ModalPages.EDIT_USER ?
        <div>
          <Typography variant='h4'>Edit User Information</Typography>
          <div className='input-info-section'>
            <Typography>Name (first and last)*:</Typography>
            <TextField 
              fullWidth 
              value={localUserData?.name} 
              onChange={handleChangeUserName} 
              onBlur={() => handleUserNameBlur(localUserData?.name ?? '')} 
              error={incorrectUserNameError}
              helperText={incorrectUserNameError ? 'User name must be provided' : ''}
              className='input-box'
            />
          </div>
          <div className='input-info-section'>
            <Typography>Primary Email*:</Typography>
            <TextField 
              fullWidth 
              value={localUserData?.email[0] || ''} 
              onChange={(e) => handleChangeUserPrimaryEmail(e)} 
              onBlur={() => handleEmailBlur(localUserData?.email[0] ?? '', 0)}
              error={emailErrors[0]}
              className='input-box'
              helperText={emailErrors[0] ? 'Entry must be in email format' : ''}
            />
          </div>
          <div className='input-info-section'>
            <Typography>Other Email(s):</Typography>
            {localUserData?.email.slice(1).map((email, index) => (
              <div className='other-email-section'>
                <TextField 
                  key={index} 
                  fullWidth 
                  value={email} 
                  onChange={(e) => handleChangeUserOtherEmails(e as React.ChangeEvent<HTMLInputElement>, index)} 
                  className='email-textfield input-box'
                  onBlur={() => handleEmailBlur(email, index + 1)} 
                  error={emailErrors[index + 1] || undefined}
                  helperText={emailErrors[index + 1] ? 'Entry must be in email format' : ''}
                />
                <IconButton onClick={() => handleDeleteOtherEmail(index)} className='delete-icon'>
                  <DeleteOutline />
                </IconButton>
              </div>
            ))}
            
              <Button className='add-email-button' onClick={handleOpenNewEmailTextField}>
                <Add />
                  <Typography className='add-other'>
                    Add other email
                  </Typography>
              </Button> 
          </div>
          <div className='input-info-section'>
            <Typography>
              GTID*:
            </Typography>
            <TextField 
              fullWidth 
              value={localUserData?.gtID} 
              onChange={handleChangeUserGtid} 
              error={incorrectGTIDValueError} 
              helperText={incorrectGTIDValueError ? 'Entry must be 9 numbers long.' : ''} 
              onBlur={handleGtIDBlur}
              className='input-box'
            />
          </div>
          <div className='input-info-section'>
            <Typography>Team Membership*:</Typography>
            <FormControl fullWidth required className='input-box'>
              <Select
                value={localUserData?.teamMembership}
                onChange={handleChangeUserTeamMembership}
                multiple
                displayEmpty
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  style: {maxHeight: '300px'}
                }}
                renderValue={(selected) => (
                  selected.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      None Selected
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )
                )}
              >
                {teamsData.map((team) => (
                  <MenuItem key={team.teamName} value={team.teamName}>
                    <Checkbox checked={localUserData?.teamMembership.includes(team.teamName)} />
                    <ListItemText primary={team.teamName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='input-info-section'>
            <Typography>Teams Advising:</Typography>
            <FormControl fullWidth className='input-box'>
              <Select
                value={localUserData?.teamsAdvising}
                onChange={handleChangeUserTeamsAdvising}
                multiple
                displayEmpty
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  style: {maxHeight: '300px'}
                }}
                renderValue={(selected) => (
                  selected.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      None Selected
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )
                )}
              >
                {teamsData.map((team) => (
                  <MenuItem key={team.teamName} value={team.teamName}>
                    <Checkbox checked={localUserData?.teamsAdvising.includes(team.teamName)} />
                    <ListItemText primary={team.teamName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className='input-info-section'>
            <Typography>Role*:</Typography>
            <FormControl fullWidth className='input-box'>
              <Select 
                value={localUserData?.role} 
                onChange={handleChangeUserRole} 
                displayEmpty
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                  style: {maxHeight: '275px'}
                }}
                renderValue={(selected) => selected.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    None Selected
                  </Typography>
                ) : (
                  <Typography>
                    {selected}
                  </Typography>
                )}
                >
                <MenuItem value='Member'>Member</MenuItem>
                <MenuItem value='President'>President</MenuItem>
                <MenuItem value='Vice President'>Vice President</MenuItem>
                <MenuItem value='Treasurer'>Treasurer</MenuItem>
                <MenuItem value='Social Chair'>Social Chair</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      : page === ModalPages.SELECT_USER ? (
        <div className='selector-centering'>
          <Typography variant='h5'>Select a user account:</Typography>
          <FormControl fullWidth>
            <Autocomplete
              options={usersData.sort((a, b) => (a.name > b.name ? 1 : -1))}
              getOptionLabel={(option) => option.name}
              value={localUserData}
              onChange={(event, newValue) => {
                if (newValue) {
                  setLocalUserData(newValue);
                  onApiInformationUpdate(newValue);
                } else {
                  setLocalUserData({
                    name: '',
                    email: [''],
                    gtID: '',
                    teamMembership: [],
                    teamsAdvising: [],
                    role: '',
                    isExec: false,
                    moduleProgress: [{
                      moduleName: '',
                      percentComplete: 0.0,
                      isAssigned: false,
                      subsectionsComplete: []
                    }]
                  });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select User" variant="outlined" />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.gtID}>
                  <Typography>{option.name}</Typography>
                </li>
              )}
            />
          </FormControl>
        </div>
      ) 





      : page == ModalPages.EDIT_TEAM ?
        <div>
          <Typography variant='h4'>Edit Team Information</Typography>
          <div className='input-info-section'>
            <Typography>Team Name*:</Typography>
            <TextField fullWidth value={localTeamData?.teamName} onChange={handleChangeTeamName} className='input-box'/>
          </div>
          <div className='input-info-section'>
            <Typography>Team Members*:</Typography>
            <FormControl fullWidth className='input-box'>
              <Autocomplete
                multiple
                options={usersData}
                value={usersData.filter((user) => localTeamData?.membership.includes(user.gtID))}
                onChange={handleChangeTeamMembership}
                disableCloseOnSelect
                PaperComponent={(props) => <StyledPaper {...props} />}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder={localTeamData?.membership.length === 0 ? "None Selected" : ''} />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.gtID}>
                    <ListItemText primary={option.name} />
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
                        <Chip key={user.gtID} label={usersGTidMap[user.gtID] || user.gtID} />
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
                options={usersData}
                value={usersData.filter((user) => localTeamData?.advisors.includes(user.gtID))}
                onChange={handleChangeTeamAdvisors}
                disableCloseOnSelect
                PaperComponent={(props) => <StyledPaper {...props} />}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder={localTeamData?.advisors.length === 0 ? "None Selected" : ''} />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.gtID}>
                    <ListItemText primary={option.name} />
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
                        <Chip key={user.gtID} label={usersGTidMap[user.gtID] || user.gtID} />
                      ))}
                    </Box>
                  )
                }
              />
            </FormControl>
          </div>
        </div>
      : page == ModalPages.SELECT_TEAM ? (
        <div className='selector-centering'>
          <Typography variant='h5'>Select a team:</Typography>
          <FormControl fullWidth>
            <Select  
              renderValue={() => <Typography>{localTeamData?.teamName}</Typography>}
              value={localTeamData?.teamName}
              onChange={(e) => {
                const team = teamsData.find((team) => team.teamName === e.target.value);
                if (team) {
                  setLocalTeamData(team);
                  onApiInformationUpdate(team);
                } else {
                  setLocalTeamData(teamsData?.find((team) => team.teamName === teamSelected) || {
                    teamName: '',
                    membership: [],
                    advisors: []
                  });
                }
              }}              
              >
              {teamsData.sort((a, b) => a.teamName > b.teamName ? 0 : -1).map((team) => (
                <MenuItem key={team.teamName} value={team.teamName}>
                  {team.teamName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )


      // maybe have html string stored, display it dynamically as dangerouslysetinnerhtml

      : page == ModalPages.EDIT_SUBSECTION ?
        <div>
          <Typography variant='h4'>Edit Subsection Information</Typography>
          <div className='input-info-section'>
            <Typography>Subsection Name*:</Typography>
            <TextField fullWidth value={localSubsectionData?.subsectionName} onChange={handleChangeSubsectionName} className='input-box'/>
          </div>
          <div className='input-info-section'>
            <Typography>Subsection HTML*:</Typography>
            <TextField fullWidth value={localSubsectionData?.subsectionHtml} onChange={handleChangeSubsectionHtml} className='input-box'/>
          </div>
        </div>
      : page == ModalPages.SELECT_SUBSECTION ?
        <div className='selector-centering'>
          <Typography variant='h5'>Select a subsection:</Typography>
          <FormControl fullWidth>
            <Select  
              renderValue={() => <Typography>{localSubsectionData?.subsectionName}</Typography>}
              value={localSubsectionData?.subsectionName}
              onChange={(e) => {
                const subsection = subsectionsData.find((subsection) => subsection.subsectionName === e.target.value);
                if (subsection) {
                  setLocalSubsectionData(subsection);
                  onApiInformationUpdate(subsection);
                } else {
                  setLocalSubsectionData(subsectionsData?.find((subsection) => subsection.subsectionName === subsectionSelected) || {
                    subsectionName: '',
                    subsectionHtml: ''
                  });
                }
              }}  
              MenuProps={{
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'right',
                },
                style: {maxHeight: '300px'}
              }}            
              >
              {subsectionsData.map((subsection) => (
                <MenuItem key={subsection.subsectionName} value={subsection.subsectionName}>
                  <ListItemText primary={subsection.subsectionName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>





      : page == ModalPages.EDIT_MODULE ? (
        <div>
          <Typography variant='h4'>Edit Module Information</Typography>
          <div className='input-info-section'>
            <Typography>Module Name*:</Typography>
            <TextField fullWidth value={localModuleData?.moduleName} onChange={handleChangeModuleName} className='input-box'/>
          </div>
          <div className='input-info-section'>
            <Typography>Module Subsections*:</Typography>
            <Typography className='italics'>Subsections need to be created before added to a module</Typography>
            <FormControl fullWidth className='input-box'>
              <Autocomplete
                multiple
                options={subsectionsData}
                value={subsectionsData.filter((subsection) => localModuleData?.subsections.includes(subsection.subsectionName))}
                onChange={handleChangeModuleSubsectionsSelection}
                disableCloseOnSelect
                PaperComponent={(props) => <StyledPaper {...props} />}
                getOptionLabel={(option) => option.subsectionName}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" placeholder={localModuleData?.subsections.length === 0 ? "None Selected" : ''} />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.subsectionName}>
                    <Checkbox checked={selected} />
                    <ListItemText primary={option.subsectionName} />
                  </li>
                )}
                renderTags={(selected) =>
                  selected.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      None Selected
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((subsection) => (
                        <Chip key={subsection.subsectionName} label={subsection.subsectionName} />
                      ))}
                    </Box>
                  )
                }
              />
            </FormControl>
          </div>
          <div className='input-info-section'>
            <Typography>Module Image*:</Typography>
            <Typography className='italics'>Include an preview for the home screen. Must be a png.</Typography>
              <input 
                accept='image/png'
                id='upload-module-image'
                type='file'
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              {selectedImage ? (
                <div className='image-upload-section'>
                  <Box>
                    <img src={selectedImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                  </Box>
                  <label htmlFor='upload-module-image' >
                    <Button color="primary" component="span">
                      <AddPhotoAlternate />
                      <Typography>
                        change selection
                      </Typography>
                    </Button>
                  </label>
                </div>
              )
              : (
                <label htmlFor='upload-module-image' >
                  <Button color="primary" component="span">
                    <AddPhotoAlternate />
                    <Typography>
                      upload photo
                    </Typography>
                  </Button>
                </label>
              )}
          </div>
        </div>
      )
      : page == ModalPages.SELECT_MODULE ? (
        <div className='selector-centering'>
          <Typography variant='h5'>Select a module:</Typography>
          <FormControl fullWidth>
            <Select  
              renderValue={() => <Typography>{localModuleData?.moduleName}</Typography>}
              value={localModuleData?.moduleName}
              onChange={(e) => {
                const module = modulesData.find((module) => module.moduleName === e.target.value);
                console.log('e is ', e)
                console.log('module is ', module)
                if (module) {
                  setLocalModuleData(module);
                  onApiInformationUpdate(module);
                } else {
                  console.log('made it in here')
                  // TODO: does this ever get reached?
                  setLocalModuleData(modulesData?.find((module) => module.moduleName === moduleSelected) || {
                    moduleName: '',
                    subsections: [],
                    imageURL: ''
                  });
                }
              }}              
              >
              {modulesData.sort((a, b) => a.moduleName > b.moduleName ? 0 : -1).map((module) => (
                <MenuItem key={module.moduleName} value={module.moduleName}>
                  {module.moduleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )





      : (page === ModalPages.CONFIRM_SAVE_USER || page === ModalPages.CONFIRM_DELETE_USER) ?
        <div>
          <Typography variant='h4'>{page === ModalPages.CONFIRM_SAVE_USER ? 'Confirm User Information:' : 'Confirm User Deletion:'}</Typography>
          <div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Name:</Typography>
              <Typography className='indent'>{localUserData?.name}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Primary email:</Typography>
              <Typography className='indent'>{localUserData?.email[0]}</Typography>
            </div>

            {(localUserData?.email && localUserData?.email.length > 1) &&
              <div className='confirm-section'>
                <Typography variant="h6" className='italics'>Other emails:</Typography>
                  {localUserData?.email.map((_email, index) => {
                    if (index > 0) {
                      return (
                        <Typography className='indent' key={index}>{localUserData?.email[index]}</Typography>
                      )
                    }
                  })}
              </div>
            }
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Team:</Typography>
              <Typography className='indent'>{localUserData?.teamMembership}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Teams advising:</Typography>
              <Typography className='indent'>{(localUserData?.teamsAdvising && localUserData?.teamsAdvising.length > 1) ? localUserData?.teamsAdvising.join(', ') : 'No teams advising'}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Role:</Typography>
              <Typography className='indent'>{localUserData?.role}</Typography>
            </div>
          </div>
        </div>
      : (page === ModalPages.CONFIRM_SAVE_MODULE || page === ModalPages.CONFIRM_DELETE_MODULE) ?
        <div>
          <Typography variant='h4'>{page === ModalPages.CONFIRM_SAVE_MODULE ? 'Confirm Module Information:' : 'Confirm Module Deletion:'}</Typography>
          <div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Module name:</Typography>
              <Typography className='indent'>{localModuleData?.moduleName}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Subsections:</Typography>
              <Typography className='indent'>{localModuleData?.subsections.join(', ')}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Module Image:</Typography>
              <img src={selectedImage || ''} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      : (page === ModalPages.CONFIRM_SAVE_SUBSECTION || page === ModalPages.CONFIRM_DELETE_SUBSECTION) ?
        <div>
          <Typography variant='h4'>{page === ModalPages.CONFIRM_SAVE_SUBSECTION ? 'Confirm Subsection Information:' : 'Confirm Subsection Deletion:'}</Typography>
          <div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Subsection name:</Typography>
              <Typography className='indent'>{localSubsectionData?.subsectionName}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Subsection Preview:</Typography>
              <div dangerouslySetInnerHTML={{__html: localSubsectionData?.subsectionHtml || ''}}/>
            </div>
          </div>
        </div>
      : (page === ModalPages.CONFIRM_SAVE_TEAM || page === ModalPages.CONFIRM_DELETE_TEAM) ?
        <div>
          <Typography variant='h4'>{page === ModalPages.CONFIRM_SAVE_TEAM ? 'Confirm Team Information:' : 'Confirm Team Deletion:'}</Typography>
          <div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Team name:</Typography>
              <Typography className='indent'>{localTeamData?.teamName}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Team Members:</Typography>
              <Typography className='indent'>{localTeamData?.membership.map((gtid) => usersGTidMap[gtid]).join(', ')}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Team Advisor(s):</Typography>
              <Typography className='indent'>{(localTeamData?.advisors && localTeamData?.advisors.length > 0) ? localTeamData?.advisors.map((gtid) => usersGTidMap[gtid]).join(', ') : 'No advisors'}</Typography>
            </div>
          </div>
        </div>
      :
        <div /> // ModalPages.NULL
      }
    </div>
  );
};

export default AdminModalContent;
