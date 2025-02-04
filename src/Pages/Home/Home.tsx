import { useNavigate } from 'react-router-dom';
import './Home.scss';
import { Alert, Box, Button, Card, CardContent, CardMedia, Dialog, LinearProgress, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import modulesSample from '../../SampleData/ModulesSample';
import { MemberInformation, ModuleInformation, PersonalModuleProgress, ModuleProgress, PageProps, StepSets, Operations, ModalPages, ApiReceiveInformation, ApiSendInformation, SubsectionInformation, TeamInformation } from '../../Types/types';
import { getSingleUserData, updateSingleUserData } from '../../utils/userApi';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { isDataValid } from '../../utils/Utils';
import teamsSample from '../../SampleData/TeamsSample';


const HomePage = ({loggedInUser}: PageProps) => {

  const navigate = useNavigate();

  const [promptForUserRecordCreation, setPromptForUserRecordCreation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [invalidapiDataToSend, setInvalidapiDataToSend] = useState(false);
  const [currUser, setCurrUser] = useState<MemberInformation>({
    userID: '',
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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log('isLoading changed', isLoading);
  }, [isLoading])
  
  

  useEffect(() => {
    const fetchData = async () => {
      let tempCurrUser: MemberInformation;
      try {
        // user record found
        const singleUserResponse = await getSingleUserData(loggedInUser?.username);
        tempCurrUser = singleUserResponse[0];
        setPromptForUserRecordCreation(!tempCurrUser);
      } catch (e) {
        // no user record found. Create new user record in DB
        console.log('must be new user. need to create user record...')
        tempCurrUser = {
          userID: '',
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
      // console.log('combined 1', combinedModules);

      combinedModules.sort((a, b) => {
        return Number(b.isAssigned) - Number(a.isAssigned);
      })
      // console.log('combined 2', combinedModules);

      setPersonalProgress({
        name: tempCurrUser?.identifiers?.name,
        modules: combinedModules
      });
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
    // setInvalidUserData(false);
  }

  const handleNext = async () => {
    if (activeStep === StepSets[Operations.ADD_USER].length - 1) {
      // submit button
      handleCloseModal();
      // setIsWaitingOnApi(true);
      console.log('data waiting for the api is: ', apiDataToSend)

      try {
        // const acctEmail = apiDataToSend.user?.identifiers?.accountEmail;
        if (!apiDataToSend.user) throw new Error;
        console.log('right before, it is:',apiDataToSend.user)
        const response = await updateSingleUserData(apiDataToSend?.user);
      } catch (exception) {
        console.log('exception!!', exception);
      }
      // based on db response, show/hide info spinner
    } else {
      const infoInputPages = [ModalPages.EDIT_MODULE, 
        ModalPages.EDIT_SUBSECTION, 
        ModalPages.EDIT_TEAM, 
        ModalPages.EDIT_USER, 
        // ModalPages.SELECT_MODULE,
        ModalPages.SELECT_SUBSECTION, 
        ModalPages.SELECT_TEAM, 
        ModalPages.SELECT_USER
      ];
      console.log('active step is: ', activeStep);


      if (infoInputPages.includes(StepSets[Operations.ADD_USER][activeStep]) && !isDataValid(apiDataToSend, undefined, activeStep)) {
        // if current step is something where information has to be input and information is invalid, throw err
        console.log('error')
        setInvalidapiDataToSend(true);
      } else {
        // console.log('no error')
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

  const handleReset = () => {
    // console.log('reset')
    setActiveStep(0);
    setApiDataToSend({
      user: undefined,
      module: undefined,
      subsection: undefined,
      team: undefined
    });
  }

  function isMemberInformation(info: any): info is MemberInformation {
    return (info as MemberInformation).identifiers.gtID !== undefined;
  }

  const handleApiInfoChange = (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside home.tsx', info);
    if (isMemberInformation(info) && loggedInUser?.signInDetails?.loginId) {
      let temp = {...apiDataToSend};
      temp.user = info;
      temp.user.identifiers.accountEmail = loggedInUser?.signInDetails?.loginId;
      temp.user.userID = loggedInUser?.username;
      setApiDataToSend(temp);
    } else {
      console.warn('invalid member information')
    }
  }

  const handleBackGroundClick = () => {
    return;
  }

  return (
    <div className='home-page-container'>
      {isLoading ? 
        <div style={{padding:'200px', width:'300px', backgroundColor: 'red'}}>
          <LinearProgress />
        </div>
      :
        <div>
          <Dialog
            fullWidth
            maxWidth='md'
            open={promptForUserRecordCreation}
            onClose={handleCloseModal}
            transitionDuration={0}
            onClick={handleBackGroundClick}
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
                    <AdminModalContent page={StepSets[Operations.ADD_USER][activeStep]} passedApiInformation={apiDataReceived} onApiInformationUpdate={handleApiInfoChange} userAdd={true} />
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
    </div>
  );
};

export default HomePage;