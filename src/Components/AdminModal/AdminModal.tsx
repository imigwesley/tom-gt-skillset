import { Stepper, Step, StepLabel, Alert, Button, Dialog, DialogContent } from "@mui/material";
import { Box } from "@mui/system";
import { ModalPages, Operations, StepSets } from "../../Types/enums";
import { AdminModalProps } from "../../Types/props";
import './AdminModal.scss';
import { useEffect, useState } from "react";
import { isActivityInformation, isDataValid, isMemberInformation, isSubsectionInformation, isTeamInformation } from "../../utils/Utils";
import { ActivityInformation, ApiSendInformation, MemberInformation, NameGTidMap, SubsectionInformation, TeamInformation } from "../../Types/types";
import EditSubsection from "../AdminModalContent/subsection/EditSubsection";
import SelectSubsection from "../AdminModalContent/subsection/SelectSubsection";
import EditActivity from "../AdminModalContent/activity/EditActivity";
import SelectActivity from "../AdminModalContent/activity/SelectActivity";
import EditTeam from "../AdminModalContent/team/EditTeam";
import SelectTeam from "../AdminModalContent/team/SelectTeam";
import EditUser from "../AdminModalContent/user/EditUser";
import SelectUser from "../AdminModalContent/user/SelectUser";
import ConfirmActivity from "../AdminModalContent/activity/ConfirmActivity";
import ConfirmUser from "../AdminModalContent/user/ConfirmUser";
import ConfirmSubsection from "../AdminModalContent/subsection/ConfirmSubsection";
import ConfirmTeam from "../AdminModalContent/team/ConfirmTeam";
import { createSingleUserData, deleteSingleUser, updateSingleUserData } from "../../utils/userApi";
import { createActivity, updateActivity, deleteActivity, addSubsectionToActivity } from "../../utils/activityApi";
import { deleteUserInCognito } from "../../utils/cognitoUtil";
import { uploadFile, deleteFile } from "../../utils/imagesApi";
import { createSubsection, updateSubsection, deleteSubsection } from "../../utils/subsectionsApi";

const AdminModal = ({currentOperation, currentUser, closeModal, passResponseProgress}: AdminModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [activePage, setActivePage] = useState(ModalPages.NULL);
  const [invalidinfoFromModalForApi, setInvalidinfoFromModalForApi] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [activityForSubsection, setActivityForSubsection] = useState('');


  /******** Data struture to send to api on admin 'submit' function *******/
  const [infoFromModalForApi, setInfoFromModalForApi] = useState<ApiSendInformation>({
    user: undefined,
    activity: undefined,
    subsection: undefined,
    team: undefined
  });
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  /*********** Information input from user ***********/
  const [localUserData, setLocalUserData] = useState<MemberInformation | null>({
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
        teamsAdvising: []
    },
    progress: [{
        activityName: '',
        subsectionProgress: []
    }]
  });
  const [localTeamData, setLocalTeamData] = useState<TeamInformation | null>({
    teamName: '',
    membership: [],
    advisors: [],
    progress: []
  });
  const [localActivityData, setLocalActivityData] = useState<ActivityInformation | null>({
    isTeam: false,
    isIndividual: false,
    activityName: '',
    subsectionNames: [],
    imagePath: ''
  })
  const [localSubsectionData, setLocalSubsectionData] = useState<SubsectionInformation | null>({
    subsectionName: '',
    subsectionHtml: '',
    hasDeliverable: false
  })

  useEffect(() => {
    // open to first page
    setActivePage(StepSets[currentOperation][0]);
  }, []);

  const handleNext = async () => {
    const infoInputPages = new Set([
      ModalPages.EDIT_ACTIVITY,
      ModalPages.EDIT_SUBSECTION,
      ModalPages.EDIT_TEAM,
      ModalPages.EDIT_USER,
      ModalPages.SELECT_ACTIVITY,
      ModalPages.SELECT_SUBSECTION,
      ModalPages.SELECT_TEAM,
      ModalPages.SELECT_USER
    ]);
  
    const currentPage = StepSets[currentOperation][activeStep];
    const requiresValidation = infoInputPages.has(currentPage);
    const isInvalid = !isDataValid(infoFromModalForApi, imageFile, activeStep);
  
    if (requiresValidation && isInvalid) {
      setInvalidinfoFromModalForApi(true);
      return;
    }
  
    setInvalidinfoFromModalForApi(false);
    setActiveStep(activeStep + 1);
    setActivePage(StepSets[currentOperation][activeStep + 1]);
  };
  

  const handleBack = () => {
    const newActiveStep = activeStep - 1;
    setActiveStep(newActiveStep);
    setActivePage(StepSets[currentOperation][newActiveStep]);
  };

  const handleSubmit = async () => {
    passResponseProgress?.({waiting: true, response: {isSuccess: null, message: ''}});
    console.log('data waiting for the api is: ', infoFromModalForApi)
    let dynamoResponse;
    let cognitoResponse;
    let s3Response;
    let tempActivity;
    let subsectionResponse;

    switch (currentOperation) {
      /***********
      * USER API CALLS
      ***********/
      case Operations.ADD_USER:
        // create user in db
        if (!infoFromModalForApi.user) throw new Error;
        // console.log('USER IS', infoFromModalForApi.user)
        dynamoResponse = await createSingleUserData(infoFromModalForApi?.user);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully created user.'} : {isSuccess: false, message: 'Failed to create user. Please try again.'})});
        break;
      case Operations.EDIT_SELF:
        if (!infoFromModalForApi.user) throw new Error;
        // console.log('USER IS', infoFromModalForApi.user)
        dynamoResponse = await updateSingleUserData(infoFromModalForApi?.user);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully edited user.'} : {isSuccess: false, message: 'Failed to edit user. Please try again.'})});
        break;

      case Operations.EDIT_USER:
        // edit record in db with information from frontend
        if (!infoFromModalForApi.user) throw new Error;
        // console.log('USER IS', infoFromModalForApi.user)
        dynamoResponse = await updateSingleUserData(infoFromModalForApi?.user);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully edited user.'} : {isSuccess: false, message: 'Failed to edit user. Please try again.'})});
        break;

      case Operations.DELETE_USER:
          if (!infoFromModalForApi.user) throw new Error;
          // remove from cognito user pool
          cognitoResponse = await deleteUserInCognito(infoFromModalForApi?.user.userId);
          // console.log('cognito delete user response is', cognitoResponse);

          // delete record in dynamo table
          dynamoResponse = await deleteSingleUser(infoFromModalForApi?.user.userId);
          // console.log('response from deletion is', dynamoResponse);

          if (cognitoResponse) {
            // update to check for dynamo response also
            passResponseProgress?.({waiting: false, response: {isSuccess: true, message: 'Successfully edited user.'}});
          } else {
            passResponseProgress?.({waiting: false, response: {isSuccess: false, message: 'Failed to edit user. Please try again.'}});
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
        if (!infoFromModalForApi.subsection) throw new Error;
        dynamoResponse = await createSubsection(infoFromModalForApi.subsection);
        subsectionResponse = await addSubsectionToActivity(activityForSubsection, infoFromModalForApi.subsection.subsectionName);
        // console.log('response adding subsection to activity is: ', subsectionResponse)
        // console.log('response from creation is: ', dynamoResponse);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully created subsection.'} : {isSuccess: false, message: 'Failed to create subsection. Please try again.'})});
        break;

      case Operations.EDIT_SUBSECTION:
        console.log('edit subsection submit');
        if (!infoFromModalForApi.subsection) throw new Error;
        dynamoResponse = await updateSubsection(infoFromModalForApi.subsection);
        if (activityForSubsection) {
          subsectionResponse = await addSubsectionToActivity(activityForSubsection, infoFromModalForApi.subsection.subsectionName);
        }
        // console.log('response adding subsection to activity is: ', subsectionResponse)
        // console.log('response from updating is: ', dynamoResponse);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully updated subsection.'} : {isSuccess: false, message: 'Failed to update subsection. Please try again.'})});
        break;

      case Operations.DELETE_SUBSECTION:
        console.log('delete subsection submit');
        if (!infoFromModalForApi.subsection) throw new Error;
        dynamoResponse = await deleteSubsection(infoFromModalForApi.subsection.subsectionName);
        // TODO: remove subsection name from all activities it is a part of - maybe a popup confirm??
        // console.log('response from deletion is: ', dynamoResponse);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully deleted subsection.'} : {isSuccess: false, message: 'Failed to delete subsection. Please try again.'})});
        break;

      /***********
      * ACTIVITIES API CALLS
      ***********/
      case Operations.ADD_ACTIVITY:
        // console.log('add new activity submit');
        if (!infoFromModalForApi.activity || !imageFile) throw new Error;
        s3Response = await uploadFile(imageFile, true);
        if (!s3Response) throw new Error;
        tempActivity = {...infoFromModalForApi.activity, imagePath: s3Response}
        dynamoResponse = await createActivity(tempActivity)
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully created activity.'} : {isSuccess: false, message: 'Failed to create activity. Please try again.'})});
        break;

      case Operations.EDIT_ACTIVITY:
        // console.log('edit activity submit');
        if (!infoFromModalForApi.activity) throw new Error;
        console.log('image file is', imageFile);
        console.log('image path is', infoFromModalForApi.activity.imagePath)
        if (imageFile) {
          s3Response = await uploadFile(imageFile, true);
          if (!s3Response) throw new Error;
        }
        tempActivity = {...infoFromModalForApi.activity, imagePath: s3Response || infoFromModalForApi.activity.imagePath}
        dynamoResponse = await updateActivity(tempActivity);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully edited activity.'} : {isSuccess: false, message: 'Failed to edit activity. Please try again.'})});
        break;

      case Operations.DELETE_ACTIVITY:
        // console.log('delete activity submit');
        if (!infoFromModalForApi.activity) throw new Error;
        dynamoResponse = await deleteActivity(infoFromModalForApi.activity.activityName);
        s3Response = await deleteFile(infoFromModalForApi.activity.imagePath, true);
        passResponseProgress?.({waiting: false, response: (dynamoResponse ? {isSuccess: true, message: 'Successfully deleted activity.'} : {isSuccess: false, message: 'Failed to delete activity. Please try again.'})});
        break;

      default:
        // console.log('default')
    }
    closeModal();

    setTimeout(() => {
      passResponseProgress?.({
        waiting: false, 
        response: {
          isSuccess: null,
          message: ''
        }
      });
    }, 2000);
  }
  
  const handleReset = () => {
    // console.log('reset')
    setActiveStep(0);
    setInfoFromModalForApi({
      user: undefined,
      activity: undefined,
      subsection: undefined,
      team: undefined
    });
    setImageFile(undefined);
  }

  const handleApiInfoUpdate = (info: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation) => {
    console.log('changed inside AdminModal.tsx', info)
    console.log('type is, ', typeof info);
    if (isMemberInformation(info)) {
      let temp = {...infoFromModalForApi, user: info};
      setInfoFromModalForApi(temp);
    } else if (isActivityInformation(info)) {
      let temp = {...infoFromModalForApi, activity: info};
      setInfoFromModalForApi(temp);
    } else if (isSubsectionInformation(info)) {
      let temp = {...infoFromModalForApi, subsection: info};
      setInfoFromModalForApi(temp);
    } else if (isTeamInformation(info)) {
      let temp = {...infoFromModalForApi, team: info};
      setInfoFromModalForApi(temp);
    }
  }

  const handleImageProvided = (file: File) => {
    console.log('image file provided is ', file);
    setImageFile(file);
  }

  const handleLocalUrlCreated = (tempUrl: string) => {
    console.log('tempUrl is', tempUrl);
    setTempImageUrl(tempUrl);
  };

  const handleActivityChosenForSubsection = (activity: string) => {
    setActivityForSubsection(activity);
  }


  return (
    <div>
      <Dialog
        fullWidth
        maxWidth='md'
        open={true}
        onClose={(event, reason) => {
          if (currentOperation !== Operations.ADD_USER || reason !== 'backdropClick') {
            closeModal();
          }
        }}
        disableEscapeKeyDown={currentOperation === Operations.ADD_USER}
        transitionDuration={0}
      >
        <div id='dialog-content' style={{height: '90vh', padding: 0}}>
          <div className='modal'>
            <Stepper activeStep={activeStep} className='modal-stepper'>
              {StepSets[currentOperation].map((label) => (
                <Step key={label}>
                  <StepLabel/>
                </Step>
              ))}
            </Stepper>
              <div className="modal-content">
                { (activePage === ModalPages.EDIT_USER) ?
                  (
                    <EditUser 
                      editOrCreate={currentOperation === Operations.ADD_USER ? 'create' : 'edit'} 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={currentUser || infoFromModalForApi.user}
                    />
                  ) : (activePage === ModalPages.EDIT_TEAM) ?
                  (
                    <EditTeam 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.team}
                    />
                  ) : (activePage === ModalPages.EDIT_SUBSECTION) ?
                  (
                    <EditSubsection 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.subsection}
                      onActivityChosenForSubsection={handleActivityChosenForSubsection}
                      activityChosen={activityForSubsection}
                    />
                  ) : (activePage === ModalPages.EDIT_ACTIVITY) ?
                  (
                    <EditActivity 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      onImageProvided={handleImageProvided}
                      onLocalUrlCreated={handleLocalUrlCreated}
                      userInput={infoFromModalForApi.activity}
                      tempImage={tempImageUrl}
                    />
                  ): (activePage === ModalPages.SELECT_USER) ?
                  (
                    <SelectUser 
                      onApiInformationUpdate={handleApiInfoUpdate}
                    />
                  )   
                  : (activePage === ModalPages.SELECT_TEAM) ?
                  (
                    <SelectTeam 
                      onApiInformationUpdate={handleApiInfoUpdate}
                    />
                  ) 
                  : (activePage === ModalPages.SELECT_SUBSECTION) ?
                  (
                    <SelectSubsection 
                      onApiInformationUpdate={handleApiInfoUpdate}
                    />
                  )  
                  : (activePage === ModalPages.SELECT_ACTIVITY) ?
                  (
                    <SelectActivity 
                      onApiInformationUpdate={handleApiInfoUpdate}
                    />
                  ) : ((activePage === ModalPages.CONFIRM_SAVE_USER) || (activePage === ModalPages.CONFIRM_DELETE_USER)) ?
                  (
                    <ConfirmUser 
                      saveOrDelete={(activePage === ModalPages.CONFIRM_SAVE_USER) ? 'save' : 'delete'} 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.user}
                    />
                  ) 
                  : ((activePage === ModalPages.CONFIRM_SAVE_TEAM) || (activePage === ModalPages.CONFIRM_DELETE_TEAM)) ?
                  (
                    <ConfirmTeam 
                      saveOrDelete={(activePage === ModalPages.CONFIRM_SAVE_TEAM) ? 'save' : 'delete'} 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.team}
                    />
                  ) : ((activePage === ModalPages.CONFIRM_SAVE_SUBSECTION) || (activePage === ModalPages.CONFIRM_DELETE_SUBSECTION)) ?
                  (
                    <ConfirmSubsection 
                      saveOrDelete={(activePage === ModalPages.CONFIRM_SAVE_SUBSECTION) ? 'save' : 'delete'} 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.subsection}
                      activityChosen={activityForSubsection}
                    />
                  ) 
                  : ((activePage === ModalPages.CONFIRM_SAVE_ACTIVITY) || (activePage === ModalPages.CONFIRM_DELETE_ACTIVITY)) ?
                  (
                    <ConfirmActivity 
                      saveOrDelete={(activePage === ModalPages.CONFIRM_SAVE_ACTIVITY) ? 'save' : 'delete'} 
                      onApiInformationUpdate={handleApiInfoUpdate}
                      userInput={infoFromModalForApi.activity}
                      tempImage={tempImageUrl}
                    />
                  ) :
                  ( <div /> )
                }
              </div>
              <div className='modal-footer'>
                { currentOperation !== Operations.ADD_USER && <Button
                  className='cancel-button'
                  onClick={closeModal}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button> }
                {invalidinfoFromModalForApi && <Alert severity='warning' className='alert'>One or more required fields is invalid or missing.</Alert>}
                <div>
                  <Button
                    // disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1, display: activeStep === 0 ? 'none': '' }}
                    className='proceed-button'
                  >
                    Back
                  </Button>
                  <Button onClick={activeStep === StepSets[currentOperation].length - 1 ? handleSubmit : handleNext} className='proceed-button'>
                    {activeStep === StepSets[currentOperation].length - 1 ? 'Submit' : 'Next'}
                  </Button>
                </div>
              </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
};
export default AdminModal;