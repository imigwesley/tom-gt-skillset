import { Box, Button, Chip, FormControl, IconButton, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import './AdminModalContent.scss';
import { useEffect, useState } from 'react';
import modulesSample from '../../SampleData/ModulesSample';
import membersSample from '../../SampleData/MembersSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import teamsSample from '../../SampleData/TeamsSample';
import Checkbox from '@mui/material/Checkbox';
import { AdminModalContentProps, ApiInformation, MemberInformation, ModalPages, TeamInformation } from '../../Types/types';
import { Add, DeleteOutline } from '@mui/icons-material';


const AdminModalContent = ({ page, passedApiInformation, onApiInformationUpdate }: AdminModalContentProps) => {
  // const [apiInformation, setApiInformation] = useState<ApiInformation>(passedApiInformation);
  const [incorrectGTIDValueError, setIncorrectGTIDValueError] = useState(false);
  const [notProvidedError, setNotProvidedError] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string>();
  const [emailErrors, setEmailErrors] = useState<boolean[]>([false]);
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
  const [teamsData, setTeamsData] = useState<TeamInformation[]>([{
    teamName: '',
    membership: [],
    advisors: []
  }]);
  const [usersData, setUsersData] = useState<MemberInformation[]>([{
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
  }]);

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setTeamsData(teamsSample);
        setUsersData(membersSample);
      }, 300);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // console.log('changed to ', emailErrors)
  }, [emailErrors])

  useEffect(() => {
    // console.log('localUser', localUserData);
  }, [localUserData]);

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: MemberInformation = {
      gtID: localUserData?.gtID || '',
      name: event.target.value,
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


  const validateEmailString = (email: string) => {
    console.log('validating')
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);
    if (email?.length !== 0 && !emailRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const handleEmailBlur = (email: string, index: number) => {
    const newErrors = [...emailErrors];
    const isValid = validateEmailString(email);
    newErrors[index] = isValid;
    console.log('setting errors handleblur')
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
    // else if (!isNaN(Number(event.target.value))) {
    //   setIncorrectGTIDValueError(false);
    // }
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

  return (
    <div className='input-info-container'>
      {page === ModalPages.EDIT_USER_INFO ?
        <div>
          <Typography variant='h4'>Edit User Information</Typography>
          <div className='input-info-section'>
            <Typography>Name (first and last)*:</Typography>
            <TextField fullWidth value={localUserData?.name} onChange={handleChangeUserName} className='input-box'/>
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
              <Select  
                renderValue={(selected) => <Typography>{localUserData?.name}</Typography>}
                value={localUserData?.gtID}
                onChange={(e) => {
                  const user = usersData.find((user) => user.gtID === e.target.value);
                  if (user) {
                    setLocalUserData(user);
                    onApiInformationUpdate(user);
                  } else {
                    setLocalUserData(usersData?.find((user) => user.gtID === userToDelete) || {
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
                >
                {usersData.sort((a, b) => a.name > b.name ? 0 : -1).map((user) => (
                  <MenuItem key={user.gtID} value={user.gtID}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        ) 
        : page == ModalPages.CONFIRM_USER ?
          <div>
            <Typography variant='h4'> Confirm User Information:</Typography>
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
                          <Typography className='indent'>{localUserData?.email[index]}</Typography>
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
                <Typography className='indent'>{(localUserData?.teamsAdvising && localUserData?.teamsAdvising.length > 1) ? localUserData?.teamsAdvising : 'No teams advising'}</Typography>
              </div>
              <div className='confirm-section'>
                <Typography variant="h6" className='italics'>Role:</Typography>
                <Typography className='indent'>{localUserData?.role}</Typography>
              </div>
            </div>
          </div>
        : page == ModalPages.CONFIRM_MODULE ?
          <div>
            <Typography variant='h3'> Confirm</Typography>
            <div>
              {/* add when get there */}
              {/* {localModuleData ? <div>User: {JSON.stringify(localModuleData)}</div> : <div>No user information found.</div>} */}
            </div>
          </div>
        : page == ModalPages.CONFIRM_SUBSECTION ?
          <div>
            <Typography variant='h3'> Confirm</Typography>
            <div>
              {/* add when get there */}
              {/* {localSubsectionData ? <div>User: {JSON.stringify(localSubsectionData)}</div> : <div>wesley</div>} */}
            </div>
          </div>
        : page == ModalPages.CONFIRM_TEAM ?
          <div>
            <Typography variant='h3'> Confirm</Typography>
            <div>
              {/* add when get there */}
              {/* {localTeamData ? <div>User: {JSON.stringify(localTeamData)}</div> : <div>wesley</div>} */}
            </div>
          </div>
        :  page == ModalPages.CONFIRM_DELETE ?
          <div>
            <Typography variant='h4'> Confirm User Deletion:</Typography>
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
                          <Typography className='indent'>{localUserData?.email[index]}</Typography>
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
                <Typography className='indent'>{(localUserData?.teamsAdvising && localUserData?.teamsAdvising.length > 1) ? localUserData?.teamsAdvising : 'No teams advising'}</Typography>
              </div>
              <div className='confirm-section'>
                <Typography variant="h6" className='italics'>Role:</Typography>
                <Typography className='indent'>{localUserData?.role}</Typography>
              </div>
            </div>
          </div>
        : page == ModalPages.EDIT_TEAM_INFO ?
          <div>
            edit tem
          </div>
        : page == ModalPages.SELECT_TEAM ?
          <div>
            select team
          </div>
        : page == ModalPages.EDIT_SUBSECTION ?
          <div>
            edit sb
          </div>
        : page == ModalPages.EDIT_MODULE ?
          <div>
            edit module
          </div>
        : page == ModalPages.SELECT_MODULE ?
          <div>
            select moduel
          </div>
        :
        <div /> // ModalPages.NULL
      }
    </div>
  );
};

export default AdminModalContent;
