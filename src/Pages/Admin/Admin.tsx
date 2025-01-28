import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, Divider, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './Admin.scss';
import { useEffect, useState } from 'react';
import modalHtml from '../../Components/AdminModalContent/AdminModalContent';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { ApiSendInformation, APIResponse, MemberInformation, ModalPages, ModuleInformation, SubsectionInformation, TeamInformation, ApiReceiveInformation, PageProps } from '../../Types/types';
// import membersSample from '../../SampleData/MembersSample';
import teamsSample from '../../SampleData/TeamsSample';
import modulesSample from '../../SampleData/ModulesSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import { signUp } from 'aws-amplify/auth';
import { getAllUsersData } from '../../utils/userApi';



const AdminPage = () => {

  // enum for each api call on the page
  enum Operations {
    NULL,
    ADD_USER,
    EDIT_USER,
    DELETE_USER,
    ADD_TEAM,
    EDIT_TEAM,
    DELETE_TEAM,
    ADD_SUBSECTION,
    EDIT_SUBSECTION,
    DELETE_SUBSECTION,
    ADD_MODULE,
    EDIT_MODULE,
    DELETE_MODULE
  };

  // mapping of which pages are needed to do each operation
  const stepSets: Record<Operations, ModalPages[]> = {
    [Operations.NULL]: [ModalPages.NULL],
    [Operations.ADD_USER]: [ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.EDIT_USER]: [ModalPages.SELECT_USER, ModalPages.EDIT_USER, ModalPages.CONFIRM_SAVE_USER],
    [Operations.DELETE_USER]: [ModalPages.SELECT_USER, ModalPages.CONFIRM_DELETE_USER],
  
    [Operations.ADD_TEAM]: [ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.EDIT_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.EDIT_TEAM, ModalPages.CONFIRM_SAVE_TEAM],
    [Operations.DELETE_TEAM]: [ModalPages.SELECT_TEAM, ModalPages.CONFIRM_DELETE_TEAM],
  
    [Operations.ADD_SUBSECTION]: [ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.EDIT_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.EDIT_SUBSECTION, ModalPages.CONFIRM_SAVE_SUBSECTION],
    [Operations.DELETE_SUBSECTION]: [ModalPages.SELECT_SUBSECTION, ModalPages.CONFIRM_DELETE_SUBSECTION],
  
    [Operations.ADD_MODULE]: [ModalPages.EDIT_MODULE, ModalPages.CONFIRM_SAVE_MODULE],
    [Operations.EDIT_MODULE]: [ModalPages.SELECT_MODULE, ModalPages.EDIT_MODULE, ModalPages.CONFIRM_SAVE_MODULE],
    [Operations.DELETE_MODULE]: [ModalPages.SELECT_MODULE, ModalPages.CONFIRM_DELETE_MODULE],
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentOperation, setCurrentOperation] = useState<Operations>(Operations.NULL);
  const [isWaitingOnApi, setIsWaitingOnApi] = useState(false);
  const [responseType, setResponseType] = useState<APIResponse>({code: 0, message: ''});
  const [invalidapiDataToSend, setInvalidapiDataToSend] = useState(false);
  // holds info received from api, puts into modal prop
  const [apiDataReceived, setApiDataReceived] = useState<ApiReceiveInformation>({
    users: undefined,
    modules: undefined,
    subsections: undefined,
    teams: undefined
  });
  // holds info to send to api on admin 'submit' function
  const [apiDataToSend, setapiDataToSend] = useState<ApiSendInformation>({
    user: undefined,
    module: undefined,
    subsection: undefined,
    team: undefined
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [allUsers, setAllUsers] = useState<MemberInformation[]>([]);

  const isDataValid = () => {
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);

    // console.log(apiDataToSend)
    // console.log('validating user: ', apiDataToSend.user)
    // console.log('validating team: ', apiDataToSend.team)
    // console.log('validating module: ', apiDataToSend.module)
    // console.log('validating image ', imageFile);

    return (
      ( // user is valid
      apiDataToSend.user
      && apiDataToSend.user.identifiers.name !== ''
      && (apiDataToSend.user.identifiers.contactEmails?.length !== 0 && apiDataToSend.user.identifiers.contactEmails[0] !== '')
      && apiDataToSend.user.identifiers.contactEmails.some(email => emailRegex.test(email)) 
      && (apiDataToSend.user.identifiers.accountEmail && emailRegex.test(apiDataToSend.user.identifiers.accountEmail))
      && apiDataToSend.user.identifiers.gtID && apiDataToSend.user?.identifiers.gtID.length === 9
      && !isNaN(Number(apiDataToSend.user.identifiers.gtID))
      && apiDataToSend.user.teams.teamMembership.length > 0
      && apiDataToSend.user.roles.role !== ''
    )
    || ( // or if team is valid
      apiDataToSend.team
      && apiDataToSend.team.teamName !== ''
      && (apiDataToSend.team.membership?.length !== 0 && apiDataToSend.team.membership[0] !== '')
      && (apiDataToSend.team.advisors?.length !== 0 && apiDataToSend.team.advisors[0] !== '')
    )
    || ( // or if module is valid (necessary info exists, image is uploaded)
      apiDataToSend.module
      && apiDataToSend.module.moduleName !== ''
      && (apiDataToSend.module.subsections?.length !== 0 && apiDataToSend.module.subsections[0] !== '')
      && imageFile
    )
    || ( // or if subsection is valid
      apiDataToSend.subsection
      && apiDataToSend.subsection.subsectionName !== ''
      && apiDataToSend.subsection.subsectionHtml !== ''
      && (activeStep === 1 ? apiDataToSend.subsection.htmlEdited : true)
    )
  ) // or () or () 
  }

  const handleOpenModal = (entity: Operations) => {
    // console.log(entity);
    setCurrentOperation(entity);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvalidapiDataToSend(false);
    handleReset();
    setCurrentOperation(Operations.NULL);
  }

  const handleNext = async () => {
    if (activeStep === stepSets[currentOperation].length - 1) {
      // submit button
      handleCloseModal();
      setIsWaitingOnApi(true);
      console.log('data waiting for the api is: ', apiDataToSend)

      // Interact with dynamodb, cognito
      switch (currentOperation) {

        /***********
        * USER API CALLS
        ***********/
        case Operations.ADD_USER:
          console.log('add new user submit');
          try {
            const acctEmail = apiDataToSend.user?.identifiers?.accountEmail;
            if (!acctEmail) throw new Error;
            const createdUserId = await createUserInUserPool(acctEmail); // add props to this function
            // create record in db with information from frontend
          } catch (exception) {
            console.log('exception!!', exception);
          }
          
          // based on db response, show/hide info spinner

          break;
        case Operations.EDIT_USER:
          console.log('edit user submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;
        case Operations.DELETE_USER:
          console.log('delete user submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;

        /***********
        * TEAM API CALLS
        ***********/
        case Operations.ADD_TEAM:
          console.log('add new team submit');
          //const createdTeamId = await createTeamInDB(); // add props to this function
          // based on db response, show/hide info spinner

          break;
        case Operations.EDIT_TEAM:
          console.log('edit team submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;
        case Operations.DELETE_TEAM:
          console.log('delete team submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;

        /***********
        * SUBSECTION API CALLS
        ***********/
        case Operations.ADD_SUBSECTION:
          console.log('add new subsection submit');
          //const createdSubsectionId = await createSubsectionInDB(); // add props to this function
          // based on db response, show/hide info spinner

          break;
        case Operations.EDIT_SUBSECTION:
          console.log('edit subsection submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;
        case Operations.DELETE_SUBSECTION:
          console.log('delete subsection submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;

        /***********
        * MODULE API CALLS
        ***********/
        case Operations.ADD_MODULE:
          console.log('add new module submit');
          //const createdModuleId = await createModuleInDB(); // add props to this function
          // based on db response, show/hide info spinner

          break;
        case Operations.EDIT_MODULE:
          console.log('edit module submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;
        case Operations.DELETE_MODULE:
          console.log('delete module submit');
          // edit record in db with information from frontend
          // based on db response, show/hide info spinner

          break;

          
        default:
          console.log('default')
      }
      // if no image provided, call straight up
      // if image provided, (1) call endpoint to upload it into s3. (2) save this url into apiDataToSend object (3) call endpoint to update module info table 


      // sample response
      const response = {
        code: 500,
        message: 'Error 500: Internal Server Error'
      }

      setTimeout(() => {
        setIsWaitingOnApi(false);
        setResponseType(response);
      }, 300);

      setTimeout(() => {
        setResponseType({
          code: 0,
          message: ''
        });
        
      }, 900)
    } else {
      // clicking 'next'
      // if (isneedingvalidation and isnotvalid) setErr
      // else if ((isneedingvalidation and isvalid) or (not needing validation)) move forward
      // console.log('is data valid?? ', isDataValid())
      // console.log('current page is ', stepSets[currentOperation][activeStep])
      const infoInputPages = [ModalPages.EDIT_MODULE, 
        ModalPages.EDIT_SUBSECTION, 
        ModalPages.EDIT_TEAM, 
        ModalPages.EDIT_USER, 
        // ModalPages.SELECT_MODULE,
        ModalPages.SELECT_SUBSECTION, 
        ModalPages.SELECT_TEAM, 
        ModalPages.SELECT_USER
      ];
      console.log(activeStep)


      if (infoInputPages.includes(stepSets[currentOperation][activeStep]) && !isDataValid()) {
        // if current step is something where information has to be input and information is invalid, throw err
        // console.log('error')
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
    setapiDataToSend({
      user: undefined,
      module: undefined,
      subsection: undefined,
      team: undefined
    });
  };

  const handleReset = () => {
    // console.log('reset')
    setActiveStep(0);
    setapiDataToSend({
      user: undefined,
      module: undefined,
      subsection: undefined,
      team: undefined
    });
    setImageFile(undefined);
  }


  // type guards

  function isMemberInformation(info: any): info is MemberInformation {
    return (info as MemberInformation).identifiers.gtID !== undefined;
  }
  
  function isModuleInformation(info: any): info is ModuleInformation {
    return (info as ModuleInformation).moduleName !== undefined;
  }
  
  function isSubsectionInformation(info: any): info is SubsectionInformation {
    return (info as SubsectionInformation).subsectionName !== undefined;
  }
  
  function isTeamInformation(info: any): info is TeamInformation {
    return (info as TeamInformation).teamName !== undefined;
  }

  const handleApiInfoChange = (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside admin.tsx', info)
    if (isMemberInformation(info)) {
      let temp = {...apiDataToSend};
      temp.user = info;
      setapiDataToSend(temp);
    } else if (isModuleInformation(info)) {
      let temp = {...apiDataToSend};
      temp.module = info;
      setapiDataToSend(temp);
    } else if (isSubsectionInformation(info)) {
      let temp = {...apiDataToSend};
      temp.subsection = info;
      setapiDataToSend(temp);
    } else if (isTeamInformation(info)) {
      let temp = {...apiDataToSend};
      temp.team = info;
      setapiDataToSend(temp);
    }
  }

  const handleImageProvided = (file: File) => {
    // console.log('file is ', file);
    setImageFile(file);
  }

  useEffect(() => {
    // console.log('apiDataToSend changed', apiDataToSend);
  }, [apiDataToSend])

  useEffect(() => {
    const fetchData = async () => {
      const tempAllUsers = getAllUsersData();
      setAllUsers(tempAllUsers);

      const _users = tempAllUsers;
      const _teams = teamsSample;
      const _modules = modulesSample;
      const _subsections = subSectionsSample;

      let temp: ApiReceiveInformation = {
        users: _users,
        teams: _teams,
        modules: _modules,
        subsections: _subsections
      }
      setApiDataReceived(temp);
    };

    fetchData();
  }, [])

  const createUserInUserPool = async (email: string) => {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password: "temporaryPassword123!",
      options: {
        userAttributes: {
          email: email,
        },
      }
    });
    console.log('userId: ', userId);
    return userId;
  }


    return (
      <div className='admin-container'>
        <div className='page-section'>
          <Typography variant='h4' className='section-header'>User Actions</Typography>
          <Paper className='calls-surface'>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add User</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds user. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_USER)}>Add User</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit User</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits user. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_USER)}>Edit User</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete User</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes user. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_USER)}>Delete User</Button>
            </div>
          </Paper>
        </div>

        <div className='page-section'>
          <Typography variant='h4' className='section-header'>Team Actions</Typography>
          <Paper className='calls-surface'>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add Skillset Team</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds skillset team. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_TEAM)}>Add Skillset Team</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit Skillset Team</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits skillset team. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_TEAM)}>Edit Skillset Team</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete Skillset Team</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes skillset team. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_TEAM)}>Delete Skillset Team</Button>
            </div>
          </Paper>
        </div>

        <div className='page-section'>
          <Typography variant='h4' className='section-header'>Module Actions</Typography>
          <Paper className='calls-surface'>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add Module Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds module subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_SUBSECTION)}>Add Module Subsection</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit Module Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits Module Subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_SUBSECTION)}>Edit Module Subsection</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete Module Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes Module Subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_SUBSECTION)}>Delete Module Subsection</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add Module</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds Module. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_MODULE)}>Add Module</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit Module</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits Module. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_MODULE)}>Edit Module</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete Module</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes Module. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_MODULE)}>Delete Module</Button>
            </div>
          </Paper>
        </div>

        <Dialog
          fullWidth
          maxWidth='md'
          open={isModalOpen}
          onClose={handleCloseModal}
          transitionDuration={0}
        >
          <Box className={'modal'}>
            <Stepper activeStep={activeStep} className='modal-stepper'>
              {stepSets[currentOperation].map((label) => (
                <Step key={label}>
                  <StepLabel/>
                </Step>
              ))}
            </Stepper>
              <div>
                <div className='modal-content'>
                  <AdminModalContent page={stepSets[currentOperation][activeStep]} passedApiInformation={apiDataReceived} onApiInformationUpdate={handleApiInfoChange} onImageProvided={handleImageProvided}/>
                </div>
                {invalidapiDataToSend && <Alert severity='warning' className='alert'>One or more required fields is invalid or missing.</Alert>}
                <div className='modal-footer'>
                  <Button
                    className='cancel-button'
                    onClick={handleCloseModal}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
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
                    {activeStep === stepSets[currentOperation].length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>

              </div>
          </Box>
        </Dialog>

        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={isWaitingOnApi}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {responseType.code !== 0 &&
          <div className='feedback-container'>
            <Alert className='feedback' severity={responseType.code === 200 ? 'success' : 'error'}>{responseType.message}</Alert>
          </div>
        }


      </div>
    );
  };
  
  export default AdminPage;