import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, Divider, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './Admin.scss';
import '../../Feedback.scss';
import { useEffect, useState } from 'react';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { ApiSendInformation, MemberInformation, SubsectionInformation, TeamInformation, ApiReceiveInformation, ActivityInformation } from '../../Types/types';
import { ModalPages, Operations, StepSets } from '../../Types/enums';
import teamsSample from '../../SampleData/TeamsSample';
import activitiesSample from '../../SampleData/ActivitiesSample';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import { getAllUsersData, updateSingleUserData, deleteSingleUser } from '../../utils/userApi';
import { isActivityInformation, isDataValid, isMemberInformation, isSubsectionInformation, isTeamInformation } from '../../utils/Utils';
import { deleteFile, uploadFile } from '../../utils/imagesApi';
import { RestApiResponse } from '@aws-amplify/api-rest/dist/esm/types';
import { deleteUserInCognito } from '../../utils/cognitoUtil';
import { createSubsection, deleteSubsection, getAllSubsections, updateSubsection } from '../../utils/subsectionsApi';
import { createActivity, deleteActivity, getAllActivities, updateActivity } from '../../utils/activityApi';


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
    activities: undefined,
    subsections: undefined,
    teams: undefined
  });
  // holds info to send to api on admin 'submit' function
  const [apiDataToSend, setapiDataToSend] = useState<ApiSendInformation>({
    user: undefined,
    activity: undefined,
    subsection: undefined,
    team: undefined
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

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

      const infoInputPages = [ModalPages.EDIT_ACTIVITY, 
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
    let dynamoResponse;
    let cognitoResponse;
    let s3Response;
    let tempActivity;

    switch (currentOperation) {
      /***********
      * USER API CALLS
      ***********/
      case Operations.EDIT_USER:
        // edit record in db with information from frontend
        if (!apiDataToSend.user) throw new Error;
        // console.log('USER IS', apiDataToSend.user)
        dynamoResponse = await updateSingleUserData(apiDataToSend?.user);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully edited user.'} : {isSuccess: false, message: 'Failed to edit user. Please try again.'});
        break;

      case Operations.DELETE_USER:
          if (!apiDataToSend.user) throw new Error;
          // remove from cognito user pool
          cognitoResponse = await deleteUserInCognito(apiDataToSend?.user.userId);
          console.log('cognito delete user response is', cognitoResponse);

          // delete record in dynamo table
          dynamoResponse = await deleteSingleUser(apiDataToSend?.user.userId);
          console.log('response from deletion is', dynamoResponse);

          if (cognitoResponse) {
            // update to check for dynamo response also
            setResponseType({isSuccess: true, message: 'Successfully edited user.'});
          } else {
            setResponseType({isSuccess: false, message: 'Failed to edit user. Please try again.'});
          }
        break;

      /***********
      * TEAM API CALLS
      ***********/
      // case Operations.ADD_TEAM:
      //   console.log('add new team submit');
      //   //const createdTeamId = await createTeamInDB(); // add props to this function
      //   // based on db response, show/hide info spinner

      //   break;
      // case Operations.EDIT_TEAM:
      //   console.log('edit team submit');
      //   // edit record in db with information from frontend
      //   // based on db response, show/hide info spinner

      //   break;
      // case Operations.DELETE_TEAM:
      //   console.log('delete team submit');
      //   // edit record in db with information from frontend
      //   // based on db response, show/hide info spinner

      //   break;

      /***********
      * SUBSECTIONS API CALLS
      ***********/
      case Operations.ADD_SUBSECTION:
        console.log('add new subsection submit');
        if (!apiDataToSend.subsection) throw new Error;
        dynamoResponse = await createSubsection(apiDataToSend.subsection);
        console.log('response from creation is: ', dynamoResponse);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully created subsection.'} : {isSuccess: false, message: 'Failed to create subsection. Please try again.'});
        break;

      case Operations.EDIT_SUBSECTION:
        console.log('edit subsection submit');
        if (!apiDataToSend.subsection) throw new Error;
        dynamoResponse = await updateSubsection(apiDataToSend.subsection);
        console.log('response from updating is: ', dynamoResponse);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully edited subsection.'} : {isSuccess: false, message: 'Failed to edit subsection. Please try again.'});
        break;

      case Operations.DELETE_SUBSECTION:
        console.log('delete subsection submit');
        if (!apiDataToSend.subsection) throw new Error;
        dynamoResponse = await deleteSubsection(apiDataToSend.subsection.subsectionName);
        console.log('response from deletion is: ', dynamoResponse);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully deleted subsection.'} : {isSuccess: false, message: 'Failed to delete subsection. Please try again.'});
        break;

      /***********
      * ACTIVITIES API CALLS
      ***********/
      case Operations.ADD_ACTIVITY:
        console.log('add new activity submit');
        if (!apiDataToSend.activity || !imageFile) throw new Error;
        s3Response = await uploadFile(imageFile, true);
        if (!s3Response) throw new Error;
        tempActivity = {...apiDataToSend.activity, imagePath: s3Response}
        dynamoResponse = await createActivity(tempActivity)
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully created activity.'} : {isSuccess: false, message: 'Failed to create activity. Please try again.'});
        break;

      case Operations.EDIT_ACTIVITY:
        console.log('edit activity submit');
        if (!apiDataToSend.activity || !imageFile) throw new Error;
        s3Response = await uploadFile(imageFile, true);
        if (!s3Response) throw new Error;
        tempActivity = {...apiDataToSend.activity, imagePath: s3Response}
        dynamoResponse = await updateActivity(tempActivity);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully edited activity.'} : {isSuccess: false, message: 'Failed to edit activity. Please try again.'});
        break;

      case Operations.DELETE_ACTIVITY:
        console.log('delete activity submit');
        if (!apiDataToSend.activity) throw new Error;
        dynamoResponse = await deleteActivity(apiDataToSend.activity.activityName);
        s3Response = await deleteFile(apiDataToSend.activity.imagePath, true);
        setResponseType(dynamoResponse ? {isSuccess: true, message: 'Successfully deleted activity.'} : {isSuccess: false, message: 'Failed to delete activity. Please try again.'});
        break;

      default:
        console.log('default')
    }

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
      activity: undefined,
      subsection: undefined,
      team: undefined
    });
  };

  const handleReset = () => {
    // console.log('reset')
    setActiveStep(0);
    setapiDataToSend({
      user: undefined,
      activity: undefined,
      subsection: undefined,
      team: undefined
    });
    setImageFile(undefined);
  }

  const handleApiInfoChange = (info: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside admin.tsx', info)
    console.log('type is, ', typeof info);
    if (isMemberInformation(info)) {
      let temp = {...apiDataToSend};
      temp.user = info;
      setapiDataToSend(temp);
    } else if (isActivityInformation(info)) {
      let temp = {...apiDataToSend};
      temp.activity = info;
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
      // refactor this??
      const allUsers = await getAllUsersData();
      const allSubsections = await getAllSubsections();
      const allActivities = await getAllActivities();

      let temp: ApiReceiveInformation = {
        users: allUsers,
        teams: teamsSample, //////////////////////// change when integrating w teams
        activities: allActivities,
        subsections: allSubsections
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
          <Typography variant='h4' className='section-header'>Activity Actions</Typography>
          <Paper className='calls-surface'>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add Activity Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds activity subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_SUBSECTION)}>Add Activity Subsection</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit Activity Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits Activity Subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_SUBSECTION)}>Edit Activity Subsection</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete Activity Subsection</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes Activity Subsection. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_SUBSECTION)}>Delete Activity Subsection</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Add Activity</Typography>
                <Typography variant='subtitle2' className='subtitle'>Adds Activity. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.ADD_ACTIVITY)}>Add Activity</Button>
            </div>
            <Divider variant='middle' />
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Edit Activity</Typography>
                <Typography variant='subtitle2' className='subtitle'>Edits Activity. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.EDIT_ACTIVITY)}>Edit Activity</Button>
            </div>
            <Divider variant='middle'/>
            <div className='call-section'>
              <div>
                <Typography variant='h6'>Delete Activity</Typography>
                <Typography variant='subtitle2' className='subtitle'>Deletes Activity. Need to provide information.</Typography>
              </div>
              <Button variant='contained' onClick={() => handleOpenModal(Operations.DELETE_ACTIVITY)}>Delete Activity</Button>
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