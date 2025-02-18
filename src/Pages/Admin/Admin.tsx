import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, Divider, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './Admin.scss';
import '../../Feedback.scss';
import { useEffect, useState } from 'react';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { ApiSendInformation, MemberInformation, ModalPages, Operations, StepSets, ModuleInformation, SubsectionInformation, TeamInformation, ApiReceiveInformation } from '../../Types/types';
import teamsSample from '../../SampleData/TeamsSample';
import modulesSample from '../../SampleData/ModulesSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import { getAllUsersData, updateSingleUserData, deleteSingleUser } from '../../utils/userApi';
import { isDataValid } from '../../utils/Utils';
import { uploadFile } from '../../utils/imagesApi';
import { RestApiResponse } from '@aws-amplify/api-rest/dist/esm/types';


const AdminPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentOperation, setCurrentOperation] = useState<Operations>(Operations.NULL);
  const [isWaitingOnApi, setIsWaitingOnApi] = useState(false);
  const [responseType, setResponseType] = useState<{isSuccess: boolean | null, message: string}>({isSuccess: null, message: ''});
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
    if (activeStep === StepSets[currentOperation].length - 1) {
      // submit button
      await handleSubmit();

    } else {
      // clicking 'next'

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

      if (infoInputPages.includes(StepSets[currentOperation][activeStep]) && !isDataValid(apiDataToSend, imageFile, activeStep)) {
        // if current step is something where information has to be input and information is invalid, throw err
        setInvalidapiDataToSend(true);
      } else {
        setInvalidapiDataToSend(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleSubmit = async () => {
    handleCloseModal();
    setIsWaitingOnApi(true);
    console.log('data waiting for the api is: ', apiDataToSend)
    let response;

    switch (currentOperation) {
      /***********
      * USER API CALLS
      ***********/
      case Operations.EDIT_USER:
        // edit record in db with information from frontend
          if (!apiDataToSend.user) throw new Error;
          // console.log('USER IS', apiDataToSend.user)
          response = await updateSingleUserData(apiDataToSend?.user);
          setResponseType(response ? {isSuccess: true, message: 'Successfully edited user.'} : {isSuccess: false, message: 'Failed to edit user. Please try again.'});
          
          // undefined if it did not go through

        break;

      case Operations.DELETE_USER:
          if (!apiDataToSend.user) throw new Error;
          // remove from cognito user pool
          response = await deleteSingleUser(apiDataToSend?.user.identifiers.gtID);
          console.log('response from deletion is', response);

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
        if (imageFile) uploadFile(imageFile);


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

    setIsWaitingOnApi(false);
    setTimeout(() => {
      setResponseType({
        isSuccess: null,
        message: ''
      });
    }, 1500);
  }
  
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
    return (info as MemberInformation)?.identifiers?.gtID !== undefined;
  }
  
  function isModuleInformation(info: any): info is ModuleInformation {
    return (info as ModuleInformation)?.moduleName !== undefined;
  }
  
  function isSubsectionInformation(info: any): info is SubsectionInformation {
    return (info as SubsectionInformation)?.subsectionName !== undefined;
  }
  
  function isTeamInformation(info: any): info is TeamInformation {
    return (info as TeamInformation)?.teamName !== undefined;
  }

  const handleApiInfoChange = (info: MemberInformation | ModuleInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside admin.tsx', info)
    console.log('type is, ', typeof info);
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
    console.log('file is ', file);
    setImageFile(file);
  }

  useEffect(() => {
    // console.log('apiDataToSend changed', apiDataToSend);
  }, [apiDataToSend])

  useEffect(() => {
    const fetchData = async () => {
      const tempAllUsers = await getAllUsersData();
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
  }, []);

    return (
      <div className='admin-container'>
        <div className='page-section'>
          <Typography variant='h4' className='section-header'>User Actions</Typography>
          <Paper className='calls-surface'>
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

        {/* <div className='page-section'>
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
        </div> */}

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
              {StepSets[currentOperation].map((label) => (
                <Step key={label}>
                  <StepLabel/>
                </Step>
              ))}
            </Stepper>
              <div>
                <div className='modal-content'>
                  <AdminModalContent page={StepSets[currentOperation][activeStep]} passedApiInformation={apiDataReceived} onApiInformationUpdate={handleApiInfoChange} onImageProvided={handleImageProvided} isCreatingUser={false}/>
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
                    {activeStep === StepSets[currentOperation].length - 1 ? 'Submit' : 'Next'}
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

        {responseType.isSuccess !== null &&
          <div className='feedback-container'>
            <Alert className='feedback' severity={responseType.isSuccess ? 'success' : 'error'}>{responseType.message}</Alert>
          </div>
        }


      </div>
    );
  };
  
  export default AdminPage;