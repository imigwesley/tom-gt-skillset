import { Autocomplete, AutocompleteChangeReason, Box, Button, Chip, FormControl, IconButton, ListItemText, MenuItem, Paper, Popper, Select, styled, TextField, Typography } from '@mui/material';
import './AdminModalContent.scss';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import modulesSample from '../../SampleData/ModulesSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import teamsSample from '../../SampleData/TeamsSample';
import Checkbox from '@mui/material/Checkbox';
import { AdminModalContentProps, ApiSendInformation, MemberInformation, ModalPages, ModuleInformation, NameGTidMap, SubsectionInformation, TeamInformation } from '../../Types/types';
import { Add, AddPhotoAlternate, DeleteOutline } from '@mui/icons-material';
import { validateEmailString } from '../../utils/Utils';
import ReactQuill from 'react-quill';

const toolbarOptions = [
  [{ 'header': [1, 2, 3, false] }],
  ['blockquote', 'code-block'],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
];


const AdminModalContent = ({ page, passedApiInformation, userAdd, onApiInformationUpdate, onImageProvided }: AdminModalContentProps) => {
  
  // user input errors
  const [incorrectUserNameError, setIncorrectUserNameError] = useState(false);
  const [incorrectGTIDValueError, setIncorrectGTIDValueError] = useState(false);
  const [emailErrors, setEmailErrors] = useState<boolean[]>([false]);

  // team input errors
  const [incorrectTeamNameError, setIncorrectTeamNameError] = useState(false);

  // subsection input errors
  const [incorrectSubsectionNameError, setIncorrectSubsectionNameError] = useState(false);

  const [userSelected, setUserSelected] = useState<string>(); // used??
  const [teamSelected, setTeamSelected] = useState<string>(); // used??
  const [moduleSelected, setModuleSelected] = useState<string>(); // used??
  const [subsectionSelected, setSubsectionSelected] = useState<string>(); // used??
  const [usersGTidMap, setUsersGTidMap] = useState<NameGTidMap>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const quillRef = useRef<ReactQuill>(null);


  // local data for editing in modal and sending to api
  const [localUserData, setLocalUserData] = useState<MemberInformation | null>({
    userID: '',
    identifiers: {
      accountEmail: '',
      name: '',
      gtID: '',
      otherEmails: []
    },
    roles: {
        role: '',
        isAdmin: false
    },
    teams: {
        teamMembership: [],
        teamsAdvising: []
    },
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
    subsectionHtml: '',
    htmlEdited: false
  })

  // all data from api
  const teamsData: TeamInformation[] = passedApiInformation.teams || [{
      teamName: '',
      membership: [],
      advisors: []
    }];
  const usersData: MemberInformation[] = passedApiInformation.users || [{
    userID: '',
    identifiers: {
      accountEmail: '',
      name: '',
      gtID: '',
      otherEmails: []
    },
    roles: {
        role: '',
        isAdmin: false
    },
    teams: {
        teamMembership: [],
        teamsAdvising: []
    },
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
    subsectionHtml: '',
    htmlEdited: false
  }];

  useEffect(() => {
    // console.log('here too, ', passedApiInformation);
    if (passedApiInformation.users) {
      setUsersGTidMap(passedApiInformation?.users.reduce((acc: {[key: string]: string}, member) => {
        acc[member.identifiers.gtID] = member.identifiers.name;
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
    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: name,
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };
    onApiInformationUpdate(temp);
  }

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _name = event.target.value;
    if (_name !== '') {
      setIncorrectUserNameError(false);
    }
    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: _name,
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };
    
    setLocalUserData(temp);
  };

  const handleChangeEmails = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (validateEmailString(event.target.value)) {
      console.log('valid on email change')
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = false;
        return newErrors;
      });
    }

    const newEmails = [...(localUserData?.identifiers.otherEmails || [])];
    newEmails[index] = event.target.value;

    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: newEmails[0],
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: newEmails
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };

    setLocalUserData(temp);
  };

  const handleEmailBlur = (email: string, index: number) => {
    if (!validateEmailString(email)) {
      console.log('invalid on email blur')
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    } else {
      const newEmails = [...(localUserData?.identifiers.otherEmails || [])];
      newEmails[index] = email;
      const temp: MemberInformation = {
        userID: localUserData?.userID || '',
        identifiers: {
          accountEmail: newEmails[0],
          name: localUserData?.identifiers.name || '',
          gtID: localUserData?.identifiers.gtID || '',
          otherEmails: newEmails
        },
        roles: {
            role: localUserData?.roles.role || '',
            isAdmin: localUserData?.roles.isAdmin || false
        },
        teams: {
            teamMembership: localUserData?.teams.teamMembership || [],
            teamsAdvising: localUserData?.teams.teamsAdvising || []
        },
        moduleProgress: localUserData?.moduleProgress || []
      };
      onApiInformationUpdate(temp);
    }    
  }

  const handleDeleteOtherEmail = (index: number) => {
    let newEmails = [...(localUserData?.identifiers.otherEmails || [])];
    console.log(newEmails);
    newEmails.splice(index + 1, 1);

    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: newEmails[0],
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: newEmails
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };

    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleOpenNewEmailTextField = () => {
    setLocalUserData((prev) => {
      const newEmails = [...(prev?.identifiers.otherEmails || []), ''];
      const temp: MemberInformation = {
        userID: localUserData?.userID || '',
        identifiers: {
          accountEmail: newEmails[0],
          name: localUserData?.identifiers.name || '',
          gtID: localUserData?.identifiers.gtID || '',
          otherEmails: newEmails
        },
        roles: {
            role: localUserData?.roles.role || '',
            isAdmin: localUserData?.roles.isAdmin || false
        },
        teams: {
            teamMembership: localUserData?.teams.teamMembership || [],
            teamsAdvising: localUserData?.teams.teamsAdvising || []
        },
        moduleProgress: localUserData?.moduleProgress || []
      };

      onApiInformationUpdate(temp);
      return temp;
    });
  };

  const handleChangeUserGtid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (isNaN(Number(value))) {
      // do not allow to write
      console.warn('nan');
      setIncorrectGTIDValueError(true);
    } else {
      // allow to write
      const temp: MemberInformation = {
        userID: localUserData?.userID || '',
        identifiers: {
          accountEmail: localUserData?.identifiers.accountEmail || '',
          name: localUserData?.identifiers.name || '',
          gtID: event.target.value,
          otherEmails: localUserData?.identifiers.otherEmails || []
        },
        roles: {
            role: localUserData?.roles.role || '',
            isAdmin: localUserData?.roles.isAdmin || false
        },
        teams: {
            teamMembership: localUserData?.teams.teamMembership || [],
            teamsAdvising: localUserData?.teams.teamsAdvising || []
        },
        moduleProgress: localUserData?.moduleProgress || []
      };
      setLocalUserData(temp);
      if (value.length === 9) {
        // if gtid is fine, turn off error
        setIncorrectGTIDValueError(false);
      }
    } 
  };


  const handleGtIDBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length != 9) {
      // invalid
      setIncorrectGTIDValueError(true);
    } else {
      // valid, send info
      const temp: MemberInformation = {
        userID: localUserData?.userID || '',
        identifiers: {
          accountEmail: localUserData?.identifiers.accountEmail || '',
          name: localUserData?.identifiers.name || '',
          gtID: event.target.value,
          otherEmails: localUserData?.identifiers.otherEmails || []
        },
        roles: {
            role: localUserData?.roles.role || '',
            isAdmin: localUserData?.roles.isAdmin || false
        },
        teams: {
            teamMembership: localUserData?.teams.teamMembership || [],
            teamsAdvising: localUserData?.teams.teamsAdvising || []
        },
        moduleProgress: localUserData?.moduleProgress || []
      };
      onApiInformationUpdate(temp);
    } 
  }

  const handleChangeUserTeamMembership = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: event.target.value,
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleChangeUserTeamsAdvising = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: localUserData?.roles.isAdmin || false
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: event.target.value
      },
      moduleProgress: localUserData?.moduleProgress || []
    };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  const handleChangeUserRole = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      userID: localUserData?.userID || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: event.target.value,
          isAdmin: event.target.value !== 'Member'
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      moduleProgress: localUserData?.moduleProgress || []
    };
    setLocalUserData(temp);
    onApiInformationUpdate(temp);
  }

  ///////////////////////////// TEAM ACTIONS ////////////////////////////////////////////////////////////////////
  const handleChangeTeamName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      setIncorrectTeamNameError(false);
    }
    const temp: TeamInformation = {
      teamName: event.target.value,
      advisors: localTeamData?.advisors || [],
      membership: localTeamData?.membership || [],
    };
    setLocalTeamData(temp);
  };

  const handleTeamNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      const temp: TeamInformation = {
        teamName: event.target.value,
        advisors: localTeamData?.advisors || [],
        membership: localTeamData?.membership || [],
      };
      onApiInformationUpdate(temp);
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
      membership: newValue.map((user) => user.identifiers.gtID),
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
      onImageProvided?.(file); // TODO: will need to update the url based on what s3 says
    }
  };


  //////////////////////////////// SUBSECTION ACTIONS /////////////////////////////////////////////////////////
  const handleChangeSubsectionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length !== 0) {
      setIncorrectSubsectionNameError(false);
    }
    const temp: SubsectionInformation = {
      subsectionName: event.target.value,
      subsectionHtml: localSubsectionData?.subsectionHtml || '',
      htmlEdited: false
    };
    setLocalSubsectionData(temp);
  };

  const handleSubsectionNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0) {
      setIncorrectSubsectionNameError(true);
    }
    const temp: SubsectionInformation = {
      subsectionName: event.target.value,
      subsectionHtml: localSubsectionData?.subsectionHtml || '',
      htmlEdited: false
    };
    onApiInformationUpdate(temp);
  };

  const handleSaveSubsectionHtml = () => {
    const currentHtml = quillRef.current?.getEditor().root.innerHTML;
    
    setLocalSubsectionData((prev) => {
        if (prev?.subsectionHtml === currentHtml) return prev; // Avoid unnecessary updates
        
        const updatedData: SubsectionInformation = {
          subsectionName: prev?.subsectionName || '',
          subsectionHtml: currentHtml || '',
          htmlEdited: true
        };

        onApiInformationUpdate(updatedData);

        return updatedData;
    });
  };

  const StyledPaper = styled(Paper)(({ theme }) => ({
    maxHeight: '200px', // Set your desired max height
    overflowY: 'auto',   // Enable vertical scrolling if needed
  }));


  return (
    <div className='input-info-container'>
      {page === ModalPages.EDIT_USER ?
        <div>
          <Typography variant='h4'>{userAdd? 'We noticed you\'re new to Skillset! Please provide some information about yourself:' : 'Edit User Information'}</Typography>
          <div className='input-info-section'>
            <Typography>Name (first and last)*:</Typography>
            <TextField 
              fullWidth 
              value={localUserData?.identifiers.name} 
              onChange={handleChangeUserName} 
              onBlur={() => handleUserNameBlur(localUserData?.identifiers.name ?? '')} 
              error={incorrectUserNameError}
              helperText={incorrectUserNameError ? 'User name must be provided' : ''}
              className='input-box'
            />
          </div>
          {!userAdd &&
            <div className='input-info-section'>
              <Typography>Primary Email*:</Typography>
              <TextField 
                fullWidth 
                value={localUserData?.identifiers.otherEmails[0] || ''} 
                onChange={(e) => handleChangeEmails(e as React.ChangeEvent<HTMLInputElement>, 0)} 
                onBlur={() => handleEmailBlur(localUserData?.identifiers.otherEmails[0] ?? '', 0)}
                error={emailErrors[0]}
                className='input-box'
                helperText={emailErrors[0] ? 'Entry must be in email format' : ''}
              />
            </div>
          }
          <div className='input-info-section'>
            <Typography>Other Email(s):</Typography>
            {localUserData?.identifiers.otherEmails.slice(1).map((email, index) => (
              <div className='other-email-section'>
                <TextField 
                  key={index} 
                  fullWidth 
                  value={email} 
                  onChange={(e) => handleChangeEmails(e as React.ChangeEvent<HTMLInputElement>, index + 1)} 
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
                <Add className='button-icon' />
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
              value={localUserData?.identifiers.gtID} 
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
                value={localUserData?.teams.teamMembership}
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
                    <Checkbox checked={localUserData?.teams.teamMembership.includes(team.teamName)} />
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
                value={localUserData?.teams.teamsAdvising}
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
                    <Checkbox checked={localUserData?.teams.teamsAdvising.includes(team.teamName)} />
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
                value={localUserData?.roles.role} 
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
                <MenuItem value='Webmaster'>Webmaster</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      : page === ModalPages.SELECT_USER ? (
        <div className='selector-centering'>
          <Typography variant='h5'>Select a user account:</Typography>
          <FormControl className='select-autocomplete'>
            <Autocomplete
              options={usersData.sort((a, b) => (a.identifiers.name > b.identifiers.name ? 1 : -1))}
              getOptionLabel={(option) => option.identifiers.name}
              value={localUserData}
              onChange={(event, newValue) => {
                if (newValue) {
                  setLocalUserData(newValue);
                  onApiInformationUpdate(newValue);
                } else {
                  setLocalUserData({
                    userID: '',
                    identifiers: {
                      accountEmail: '',
                      name: '',
                      gtID: '',
                      otherEmails: []
                    },
                    roles: {
                        role: '',
                        isAdmin: false
                    },
                    teams: {
                        teamMembership: [],
                        teamsAdvising: []
                    },
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
                <TextField 
                  {...params} 
                  placeholder="Select/type user name"
                  variant="outlined" 
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.identifiers.gtID}>
                  <Typography>{option.identifiers.name}</Typography>
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
                options={usersData}
                value={usersData.filter((user) => localTeamData?.membership.includes(user.identifiers.gtID))}
                onChange={handleChangeTeamMembership}
                disableCloseOnSelect
                PaperComponent={(props) => <StyledPaper {...props} />}
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
                        <Chip key={user.identifiers.gtID} label={usersGTidMap[user.identifiers.gtID] || user.identifiers.gtID} />
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
                value={usersData.filter((user) => localTeamData?.advisors.includes(user.identifiers.name))}
                onChange={handleChangeTeamAdvisors}
                disableCloseOnSelect
                PaperComponent={(props) => <StyledPaper {...props} />}
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
                        <Chip key={user.identifiers.gtID} label={usersGTidMap[user.identifiers.gtID] || user.identifiers.gtID} />
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
          <FormControl className='select-autocomplete'>
            <Select
              displayEmpty
              renderValue={() => <Typography>{localTeamData?.teamName || 'Select a team'}</Typography>}
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

      : page == ModalPages.EDIT_SUBSECTION ?
        <div>
          <Typography variant='h4'>Edit Subsection Information</Typography>
          <div className='input-info-section'>
            <Typography>Subsection Name*:</Typography>
            <TextField 
              fullWidth 
              value={localSubsectionData?.subsectionName} 
              onChange={handleChangeSubsectionName} 
              onBlur={handleSubsectionNameBlur}
              className='input-box'
              error={incorrectSubsectionNameError}
              helperText={incorrectSubsectionNameError ? 'Subsection name is required' : ''}
            />
          </div>
          <div className='input-info-section'>
            <Typography>Subsection Content*:</Typography>
            <ReactQuill 
              value={localSubsectionData?.subsectionHtml} 
              modules={{toolbar: toolbarOptions}}
              ref={quillRef}
            />
            <button onClick={handleSaveSubsectionHtml}>Save</button>
          </div>
          <div className='input-info-section'>
            <Typography>Assign to Module:</Typography>
            <FormControl fullWidth className='input-box'>
              <Select  
                // fullWidth
                // renderValue={() => <Typography>{localModuleData?.moduleName}</Typography>}
                // value={localModuleData?.moduleName}
                onChange={(e) => {
                  const module = modulesData.find((module) => module.moduleName === e.target.value);
                  console.log('e is ', e)
                  console.log('module is ', module)
                  // TODO: add in ability to send this to api
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
        </div>
      : page == ModalPages.SELECT_SUBSECTION ?
        <div className='selector-centering'>
          <Typography variant='h5'>Select a subsection:</Typography>
          <FormControl className='select-autocomplete'>
            <Autocomplete
              options={subsectionsData.sort((a, b) => (a.subsectionName > b.subsectionName ? 1 : -1))}
              getOptionLabel={(option) => option.subsectionName}
              value={localSubsectionData}
              onChange={(event, newValue) => {
                // const subsection = subsectionsData.find((subsection) => subsection.subsectionName === e.target.value);
                if (newValue) {
                  setLocalSubsectionData(newValue);
                  onApiInformationUpdate(newValue);
                } else {
                  setLocalSubsectionData(subsectionsData?.find((subsection) => subsection.subsectionName === subsectionSelected) || {
                    subsectionName: '',
                    subsectionHtml: '',
                    htmlEdited: false
                  });
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Select/type subsection name"
                  variant="outlined" 
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={1}>
                  <Typography>{option.subsectionName}</Typography>
                </li>
              )}
            />
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
            <Typography className='italics'>Subsections must be created before being added to a module</Typography>
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
                      <AddPhotoAlternate className='button-icon'/>
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
                    <AddPhotoAlternate className='button-icon'/>
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
          <FormControl className='select-autocomplete'>
            <Select  
              displayEmpty
              renderValue={() => <Typography>{localModuleData?.moduleName || 'Select a module'}</Typography>}
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
              <Typography className='indent'>{localUserData?.identifiers.name}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>GTID:</Typography>
              <Typography className='indent'>{localUserData?.identifiers.gtID}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Primary email:</Typography>
              <Typography className='indent'>{localUserData?.identifiers.otherEmails[0]}</Typography>
            </div>

            {(localUserData?.identifiers.otherEmails && localUserData?.identifiers.otherEmails.length > 1) &&
              <div className='confirm-section'>
                <Typography variant="h6" className='italics'>Other emails:</Typography>
                  {localUserData?.identifiers.otherEmails.map((_email, index) => {
                    if (index > 0) {
                      return (
                        <Typography className='indent' key={index}>{localUserData?.identifiers.otherEmails[index]}</Typography>
                      )
                    }
                  })}
              </div>
            }
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Team:</Typography>
              <Typography className='indent'>{localUserData?.teams.teamMembership}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Teams advising:</Typography>
              <Typography className='indent'>{(localUserData?.teams.teamsAdvising && localUserData?.teams.teamsAdvising.length > 1) ? localUserData?.teams.teamsAdvising.join(', ') : 'No teams advising'}</Typography>
            </div>
            <div className='confirm-section'>
              <Typography variant="h6" className='italics'>Role:</Typography>
              <Typography className='indent'>{localUserData?.roles.role}</Typography>
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
              <div className='quill'>
                <div className='ql-snow'>
                  <div className='ql-editor preview-section' dangerouslySetInnerHTML={{__html: localSubsectionData?.subsectionHtml || ''}}/>
                </div>
              </div>
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
