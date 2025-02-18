import { useNavigate } from 'react-router-dom';
import './Home.scss';
import '../../Feedback.scss';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Dialog, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import modulesSample from '../../SampleData/ModulesSample';
import { MemberInformation, ModuleInformation, PersonalModuleProgress, ModuleProgress, PageProps, StepSets, Operations, ModalPages, ApiReceiveInformation, ApiSendInformation, SubsectionInformation, TeamInformation } from '../../Types/types';
import { createSingleUserData, getSingleUserData } from '../../utils/userApi';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { isDataValid } from '../../utils/Utils';
import teamsSample from '../../SampleData/TeamsSample';
import { RestApiResponse } from '@aws-amplify/api-rest/dist/esm/types';


const HomePage = ({loggedInUser, onUserCreation}: PageProps) => {

  const navigate = useNavigate();

  const [promptForUserRecordCreation, setPromptForUserRecordCreation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [invalidapiDataToSend, setInvalidapiDataToSend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [responseType, setResponseType] = useState(0);
  const [currUser, setCurrUser] = useState<MemberInformation>({
    userId: '',
    identifiers: {
      accountEmail: '',
      name: '',
      gtID: '',
      otherEmails: ['']
    },
    roles: {
        role: '',
        isAdmin: false
    },
    teams: {
        teamMembership: [''],
        teamsAdvising: ['']
    },
    moduleProgress: [{
        moduleName: '',
        percentComplete: 0.0,
        isAssigned: false,
        subsectionsComplete: []
    }]
  });
  const [apiDataReceived, setApiDataReceived] = useState<ApiReceiveInformation>({
    users: undefined,
    modules: undefined,
    subsections: undefined,
    teams: undefined
  });
  const [apiDataToSend, setApiDataToSend] = useState<ApiSendInformation>({
    user: undefined,
    module: undefined,
    subsection: undefined,
    team: undefined
  });

  const [modules, setModules] = useState<ModuleInformation[]>([
    {
      moduleName: '',
      subsections: ['', ''],
      imageURL: ''
    }
  ]);

  const [personalProgress, setPersonalProgress] = useState<PersonalModuleProgress>(
    {
      name: '',
      modules: [
        {
          isAssigned: false,
          progress: 0,
          moduleName: '',
          subsections: ['', ''],
          imageURL: '',
        }
      ]
  })
  
  useEffect(() => {
    console.log('isLoading changed', isLoading);
  }, [isLoading])

  const checkForUserAcct = async () => {
    let tempCurrUser: MemberInformation;
    try {
      // user record found
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      tempCurrUser = singleUserResponse[0];
      setPromptForUserRecordCreation(!tempCurrUser);
    } catch (e) {
      // no user record found. Create new user record in DB
      tempCurrUser = {
        userId: '',
        identifiers: {
          accountEmail: '',
          name: '',
          gtID: '',
          otherEmails: ['']
        },
        roles: {
            role: '',
            isAdmin: false
        },
        teams: {
            teamMembership: [''],
            teamsAdvising: ['']
        },
        moduleProgress: [{
            moduleName: '',
            percentComplete: 0.0,
            isAssigned: false,
            subsectionsComplete: []
        }]
      }
    }
    return tempCurrUser;
  };

  const matchProgressInformation = (tempCurrUser: MemberInformation) => {
    const modules = modulesSample;
    const _teams = teamsSample;


    let temp: ApiReceiveInformation = {
      users: [],
      teams: _teams,
      modules: [],
      subsections: []
    }
    setApiDataReceived(temp);

    setModules(modulesSample);
    setCurrUser(tempCurrUser);

    // find modules where user has progress, which user is assigned to
    const combinedModules = modules.map((module: ModuleInformation) => {
    const matchingProgressModule = tempCurrUser?.moduleProgress?.find((m: ModuleProgress) => m.moduleName === module.moduleName);
      return {
        ...module,
        progress: matchingProgressModule ? matchingProgressModule.percentComplete : 0,
        isAssigned: matchingProgressModule ? matchingProgressModule.isAssigned : false
      }
    })

    combinedModules.sort((a, b) => {
      return Number(b.isAssigned) - Number(a.isAssigned);
    })

    setPersonalProgress({
      name: tempCurrUser?.identifiers?.name,
      modules: combinedModules
    });
  }
  

  useEffect(() => {
    const fetchData = async () => {
      const tempCurrUser = await checkForUserAcct();
      matchProgressInformation(tempCurrUser);      
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, []);  

  const handleCardClick = (moduleName: string) => {
    console.log(moduleName);
    navigate(`/modules/${moduleName}`);
  }

  const handleCloseModal = () => {
    setPromptForUserRecordCreation(false);
    if (onUserCreation) onUserCreation();
    // setInvalidUserData(false);
  }

  const handleApiResponseCode = (response: RestApiResponse | undefined) => {
    setResponseType(response?.statusCode || 0);
    setTimeout(() => {
      setResponseType(0);
    }, 1100);
  }

  const handleNext = async () => {
    if (activeStep === 1) {
      // submit button
      handleCloseModal();
      setIsLoading(true);
      console.log('data waiting for the api is: ', apiDataToSend)

      if (!apiDataToSend.user) throw new Error;
      console.log('right before creation it is:',apiDataToSend.user)
      const response = await createSingleUserData(apiDataToSend?.user);
      console.log('response is', response)
      setCurrUser(apiDataToSend?.user);
      handleApiResponseCode(response);
      setIsLoading(false);
    } else {
      // next button
      if (!isDataValid(apiDataToSend, undefined, activeStep)) {
        setInvalidapiDataToSend(true);
      } else {
        setInvalidapiDataToSend(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setApiDataToSend({
      user: undefined,
      module: undefined,
      subsection: undefined,
      team: undefined
    });
  };

  function isMemberInformation(info: any): info is MemberInformation {
    return (info as MemberInformation).identifiers.gtID !== undefined;
  }

  const handleApiInfoChange = (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside home.tsx', info);
    if (isMemberInformation(info) && loggedInUser?.signInDetails?.loginId) {
      let temp = {...apiDataToSend};
      temp.user = info;
      temp.user.identifiers.accountEmail = loggedInUser?.signInDetails?.loginId;
      temp.user.userId = loggedInUser?.username;
      temp.user.roles = {
        isAdmin: false,
        role: 'Member'
      }
      setApiDataToSend(temp);
    } else {
      console.warn('invalid member information')
    }
  }

  return (
    <div className='home-page-container'>
      {isLoading ? 
        <div style={{padding:'200px', width:'300px'}}>
          <CircularProgress />
        </div>
      :
        <div>
          <Dialog
            fullWidth
            maxWidth='md'
            open={promptForUserRecordCreation}
            onClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                handleCloseModal();
              }
            }}
            disableEscapeKeyDown
            transitionDuration={0}
          >
            <Box className={'modal'}>
              <Stepper activeStep={activeStep} className='modal-stepper'>
                {StepSets[Operations.ADD_USER].map((label) => (
                  <Step key={label}>
                    <StepLabel/>
                  </Step>
                ))}
              </Stepper>
                <div>
                  <div className='modal-content'>
                    <AdminModalContent page={StepSets[Operations.ADD_USER][activeStep]} passedApiInformation={apiDataReceived} onApiInformationUpdate={handleApiInfoChange} isCreatingUser={true} />
                  </div>
                  {invalidapiDataToSend && <Alert severity='warning' className='alert'>One or more required fields is invalid or missing.</Alert>}
                  <div className='modal-footer'>
                    <div style={{flexGrow: '1'}} />
                    <Button
                      // disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1, display: activeStep === 0 ? 'none': '' }}
                      className='proceed-button'
                    >
                      Back
                    </Button>
                    <Button onClick={handleNext} className='proceed-button'>
                      {activeStep === StepSets[Operations.ADD_USER].length - 1 ? 'Submit' : 'Next'}
                    </Button>
                  </div>

                </div>
            </Box>
          </Dialog>
          <div className='header'>
            <Typography variant='h4' align='center'>
              Hello, {currUser?.identifiers?.name}! What would you like to learn today?
            </Typography>
          </div>
          <div className='module-card-container'>
            {personalProgress.modules.map((module, index) => {
              return (
                <Card className={`module-card ${module.isAssigned ? 'assigned' : ''}`} onClick={() => handleCardClick(module.moduleName)} key={index}>
                  <CardMedia
                    className='module-image'
                    image={module.imageURL}
                  />
                  <CardContent className='module-card-content'>
                    <Typography>
                      {module.moduleName}
                    </Typography>
                    <LinearProgressWithLabel progress={module.progress} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      }

      {responseType !== 0 &&
        <div className='feedback-container'>
          <Alert className='feedback' severity={responseType === 200 ? 'success' : 'error'}>{responseType === 200 ? 'Success creating user account' : 'Error creating user account.'}</Alert>
        </div>
      }
    </div>
  );
};

export default HomePage;