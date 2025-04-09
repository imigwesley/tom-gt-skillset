import { DeleteOutline, Add } from "@mui/icons-material";
import { Typography, TextField, IconButton, Button, FormControl, Select, MenuItem, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { MemberInformation } from "../../../Types/types";
import { isMemberInformation, validateEmailString } from "../../../utils/Utils";
import { AdminModalContentProps } from "../../../Types/props";
import { useEffect, useState } from "react";
import '../AdminModalContent.scss';
import { fetchAuthSession } from "@aws-amplify/core";



const EditUser = ({editOrCreate, onApiInformationUpdate, userInput}: AdminModalContentProps) => {
  // user input errors
  const [incorrectUserNameError, setIncorrectUserNameError] = useState(false);
  const [incorrectGTIDValueError, setIncorrectGTIDValueError] = useState(false);
  const [emailErrors, setEmailErrors] = useState<boolean[]>([false]);

  const [localUserData, setLocalUserData] = useState<MemberInformation>(
    {
      userId: '',
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
          teamsAdvising: [],
      },
      progress: [],
  }
);


  useEffect(() => {
    const updateUserData = async () => {
      
      if (userInput && isMemberInformation(userInput)) {
        const session = await fetchAuthSession();
  
        if (session) {
          let temp = { ...userInput };
  
          temp.identifiers.accountEmail = userInput.identifiers.accountEmail || session.tokens?.signInDetails?.loginId || '';
          temp.userId = userInput.userId || session.userSub || '';
          temp.roles = userInput.roles.role ? userInput.roles : {
            isAdmin: false,
            role: 'Member'
          };
          setLocalUserData(temp);
        }
      }
    };
  
    updateUserData();
  }, [userInput]);
  
  
  const handleUserNameBlur = (name: string) => {
    // console.log('name on blur is', name);
    if (name === '' || !/\s/.test(name)) {
      setIncorrectUserNameError(true);
    }
    const temp: MemberInformation = {
      userId: localUserData?.userId || '',
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
      progress: localUserData?.progress || []
    };
    onApiInformationUpdate?.(temp);
  }

  const handleChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _name = event.target.value;
    if (_name !== '') {
      setIncorrectUserNameError(false);
    }
    const temp: MemberInformation = {
      userId: localUserData?.userId || '',
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
      progress: localUserData?.progress || []
    };
    
    setLocalUserData(temp);
  };


  const handleChangeEmails = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {    
    if (validateEmailString(event.target.value)) {
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = false;
        return newErrors;
      });
    }
  
    setLocalUserData((prevData) => {
      const newEmails = [...(prevData.identifiers.otherEmails || [])];
      newEmails[index] = event.target.value;

      return {
        ...prevData,
        identifiers: {
          ...prevData.identifiers,
          otherEmails: newEmails
        }
      };
    });
  };

  const handleEmailBlur = (email: string, index: number) => {
    if (!validateEmailString(email)) {
      setEmailErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = true;
        return newErrors;
      });
    } else {
      const newEmails = [...(localUserData?.identifiers.otherEmails || [])];
      newEmails[index] = email;
  
      onApiInformationUpdate?.({ 
        ...localUserData, 
        identifiers: { ...localUserData.identifiers, otherEmails: newEmails } 
      });
    }
  };

  const handleDeleteOtherEmail = (index: number) => {
    const newEmails = [...(localUserData?.identifiers.otherEmails || [])];
    newEmails.splice(index, 1);
  
    setLocalUserData((prev) => ({
      ...prev,
      identifiers: { ...prev.identifiers, otherEmails: newEmails }
    }));
  
    onApiInformationUpdate?.({ ...localUserData, identifiers: { ...localUserData.identifiers, otherEmails: newEmails } });
  };

  const handleOpenNewEmailTextField = () => {
    const newEmails = [...(localUserData?.identifiers.otherEmails || []), ''];
  
    setLocalUserData((prev) => ({
      ...prev,
      identifiers: { ...prev.identifiers, otherEmails: newEmails }
    }));
  
    onApiInformationUpdate?.({ ...localUserData, identifiers: { ...localUserData.identifiers, otherEmails: newEmails } });
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
        userId: localUserData?.userId || '',
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
        progress: localUserData?.progress || []
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
        userId: localUserData?.userId || '',
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
        progress: localUserData?.progress || []
      };
      onApiInformationUpdate?.(temp);
    } 
  }

  // const handleChangeUserTeamMembership = (event: { target: { value: any; }; }) => {
  //   const temp: MemberInformation = {
  //     userId: localUserData?.userId || '',
  //     identifiers: {
  //       accountEmail: localUserData?.identifiers.accountEmail || '',
  //       name: localUserData?.identifiers.name || '',
  //       gtID: localUserData?.identifiers.gtID || '',
  //       otherEmails: localUserData?.identifiers.otherEmails || []
  //     },
  //     roles: {
  //         role: localUserData?.roles.role || '',
  //         isAdmin: localUserData?.roles.isAdmin || false
  //     },
  //     teams: {
  //         teamMembership: event.target.value,
  //         teamsAdvising: localUserData?.teams.teamsAdvising || []
  //     },
  //     progress: localUserData?.progress || []
  //   };
  //   setLocalUserData(temp);
  //   onApiInformationUpdate?.(temp);
  // }

  // const handleChangeUserTeamsAdvising = (event: { target: { value: any; }; }) => {
  //   const temp: MemberInformation = {
  //     userId: localUserData?.userId || '',
  //     identifiers: {
  //       accountEmail: localUserData?.identifiers.accountEmail || '',
  //       name: localUserData?.identifiers.name || '',
  //       gtID: localUserData?.identifiers.gtID || '',
  //       otherEmails: localUserData?.identifiers.otherEmails || []
  //     },
  //     roles: {
  //         role: localUserData?.roles.role || '',
  //         isAdmin: localUserData?.roles.isAdmin || false
  //     },
  //     teams: {
  //         teamMembership: localUserData?.teams.teamMembership || [],
  //         teamsAdvising: event.target.value
  //     },
  //     progress: localUserData?.progress || []
  //   };
  //   setLocalUserData(temp);
  //   onApiInformationUpdate?.(temp);
  // }

  const handleChangeUserRole = (event: { target: { value: any; }; }) => {
    const temp: MemberInformation = {
      userId: localUserData?.userId || '',
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
      progress: localUserData?.progress || []
    };
    setLocalUserData(temp);
    onApiInformationUpdate?.(temp);
  }

  const handleChangeUserAdminStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp: MemberInformation = {
      userId: localUserData?.userId || '',
      identifiers: {
        accountEmail: localUserData?.identifiers.accountEmail || '',
        name: localUserData?.identifiers.name || '',
        gtID: localUserData?.identifiers.gtID || '',
        otherEmails: localUserData?.identifiers.otherEmails || []
      },
      roles: {
          role: localUserData?.roles.role || '',
          isAdmin: event.target.value === 'Yes'
      },
      teams: {
          teamMembership: localUserData?.teams.teamMembership || [],
          teamsAdvising: localUserData?.teams.teamsAdvising || []
      },
      progress: localUserData?.progress || []
    };

    setLocalUserData(temp);
    onApiInformationUpdate?.(temp);
  };


  return (
    <div className='input-info-container'>
      <Typography variant='h4'>{(editOrCreate === 'create') ? 'We noticed you\'re new to Skillset! Please provide some information about yourself:' : 'Edit User Information'}</Typography>
      <div className='input-info-section'>
        <Typography>Name (first and last)*:</Typography>
        <TextField 
          fullWidth 
          value={localUserData?.identifiers.name} 
          onChange={handleChangeUserName} 
          onBlur={() => handleUserNameBlur(localUserData?.identifiers.name ?? '')} 
          error={incorrectUserNameError}
          helperText={incorrectUserNameError ? 'First and last name must be provided' : ''}
          className='input-box'
        />
      </div>
      {/* {(editOrCreate === 'edit') &&
        <div className='input-info-section'>
          <Typography>Primary Email*:</Typography>
          <TextField 
            fullWidth 
            value={localUserData?.identifiers.accountEmail || ''} 
            onChange={(e) => handleChangeEmails(e as React.ChangeEvent<HTMLInputElement>, 0)} 
            onBlur={() => handleEmailBlur(localUserData?.identifiers.otherEmails[0] ?? '', 0)}
            error={emailErrors[0]}
            className='input-box'
            helperText={emailErrors[0] ? 'Entry must be in email format' : ''}
          />
        </div>
      } */}

        <div className='input-info-section'>
          <Typography>Account Email:</Typography>
          <Typography variant="body2">Email used for login. Cannot be edited.</Typography>
          <TextField 
            fullWidth 
            value={localUserData?.identifiers.accountEmail} 
            className='input-box'
            disabled
          />
        </div>
      <div className='input-info-section'>
        <Typography>Other Email(s):</Typography>
        {localUserData?.identifiers.otherEmails.map((email, index) => (
          <div className='other-email-section' key={index}>
            <TextField 
              fullWidth 
              value={email} 
              onChange={(e) => handleChangeEmails(e as React.ChangeEvent<HTMLInputElement>, index)} 
              className='email-textfield input-box'
              onBlur={() => handleEmailBlur(email, index)} 
              error={emailErrors[index] || undefined}
              helperText={emailErrors[index] ? 'Entry must be in email format' : ''}
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
      {/* <div className='input-info-section'>
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
      </div> */}
      {(editOrCreate === 'edit') && 
      <>
      <div className='input-info-section'>
        <Typography>Role*:</Typography>
        <FormControl fullWidth className='input-box'>
          <Select 
            value={localUserData?.roles.role || 'Member'} 
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
            renderValue={(selected) => selected?.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                None Selected
              </Typography>
            ) : (
              <Typography>
                {selected}
              </Typography>
            )}
          >
            {/* {UserRoles.map((role) => {
              return (
                <MenuItem value={role}>{role}</MenuItem>
              )
            })} */}
            <MenuItem value='Member'>Member</MenuItem>
            <MenuItem value='President'>President</MenuItem>
            <MenuItem value='Vice President'>Vice President</MenuItem>
            <MenuItem value='Treasurer'>Treasurer</MenuItem>
            <MenuItem value='Social Chair'>Social Chair</MenuItem>
            <MenuItem value='Webmaster'>Webmaster</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className='input-info-section'>
      <Typography>Allow User To Have Admin Access?:</Typography>
      <FormControl>
        <RadioGroup
          name="radio-buttons-group"
          value={localUserData.roles.isAdmin ? 'Yes' : 'No'}
          onChange={handleChangeUserAdminStatus}
        >
          <FormControlLabel value="Yes" control={<Radio disableTouchRipple />} label="Yes" />
          <FormControlLabel value="No" control={<Radio disableTouchRipple />} label="No" />
        </RadioGroup>
      </FormControl>
    </div>
    </>
      }
    </div>
  );
};

export default EditUser;