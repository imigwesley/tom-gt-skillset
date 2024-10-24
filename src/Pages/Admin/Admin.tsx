import { Alert, Backdrop, Box, Button, CircularProgress, Dialog, Divider, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './Admin.scss';
import { useEffect, useState } from 'react';
import modalHtml from '../../Components/AdminModalContent/AdminModalContent';
import AdminModalContent from '../../Components/AdminModalContent/AdminModalContent';
import { ApiInformation, APIResponse, MemberInformation, ModalPages, ModuleInformation, SubsectionInformation, TeamInformation } from '../../Types/types';


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

  // enum for each page within the operation

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
  const [invalidApiData, setInvalidApiData] = useState(false);
  const [apiData, setApiData] = useState<ApiInformation>({
    user: undefined,
    module: undefined,
    subsection: undefined,
    team: undefined
  });

  const isDataValid = () => {
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/);

    // console.log(apiData)
    console.log('validating user: ', apiData.user)
    console.log('validating team: ', apiData.team)
    return (
      ( // user is valid
      apiData.user
      && apiData.user.name !== ''
      && (apiData.user.email?.length !== 0 && apiData.user.email[0] !== '')
      && apiData.user.email.some(email => emailRegex.test(email)) 
      && apiData.user.gtID && apiData.user?.gtID.length === 9
      && !isNaN(Number(apiData.user.gtID))
      && apiData.user.teamMembership.length > 0
      && apiData.user.role !== ''
    )
    || ( // or if team is valid
      apiData.team
      && apiData.team.teamName !== ''
      && (apiData.team.membership?.length !== 0 && apiData.team.membership[0] !== '')
      && (apiData.team.advisors?.length !== 0 && apiData.team.advisors[0] !== '')
    )) // or () or () 
  }

  const handleOpenModal = (entity: Operations) => {
    console.log(entity);
    setCurrentOperation(entity);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setInvalidApiData(false);
    handleReset();
    setCurrentOperation(Operations.NULL);
  }

  const handleNext = () => {
    if (activeStep === stepSets[currentOperation].length - 1) {
      // submit button
      handleCloseModal();
      setIsWaitingOnApi(true);

      // make api call
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
      console.log('is data valid?? ', isDataValid())
      console.log('current page is ', stepSets[currentOperation][activeStep])
      const infoInputPages = [ModalPages.EDIT_MODULE, 
        ModalPages.EDIT_SUBSECTION, 
        ModalPages.EDIT_TEAM, 
        ModalPages.EDIT_USER, 
        ModalPages.SELECT_MODULE, 
        ModalPages.SELECT_SUBSECTION, 
        ModalPages.SELECT_TEAM, 
        ModalPages.SELECT_USER
      ];

      if (infoInputPages.includes(stepSets[currentOperation][activeStep]) && !isDataValid()) {
        // if current step is something where information has to be input and information is invalid, throw err
        console.log('error')
        setInvalidApiData(true);
      } else {
        console.log('no error')
        setInvalidApiData(false);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setApiData({
      user: undefined,
      module: undefined,
      subsection: undefined,
      team: undefined
    });
  }


  // type guards

  function isMemberInformation(info: any): info is MemberInformation {
    return (info as MemberInformation).gtID !== undefined;
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
    console.log('info is ', info)
    if (isMemberInformation(info)) {
      let temp = {...apiData};
      temp.user = info;
      setApiData(temp);
    } else if (isModuleInformation(info)) {
      let temp = {...apiData};
      temp.module = info;
      setApiData(temp);
    } else if (isSubsectionInformation(info)) {
      let temp = {...apiData};
      temp.subsection = info;
      setApiData(temp);
    } else if (isTeamInformation(info)) {
      let temp = {...apiData};
      temp.team = info;
      setApiData(temp);
    }
    // console.log('apiData inside Admin.tsx is ', apiData)
  }

  useEffect(() => {
    console.log('apiData changed', apiData);
  }, [apiData])


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
                  <AdminModalContent page={stepSets[currentOperation][activeStep]} passedApiInformation={apiData} onApiInformationUpdate={handleApiInfoChange}/>
                </div>
                {invalidApiData && <Alert severity='warning' className='alert'>One or more required fields is invalid or missing.</Alert>}
                <div className='modal-footer'>
                  <Button
                    className='cancel-button'
                    variant='outlined'
                    onClick={handleCloseModal}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <div style={{flexGrow: '1'}} />
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Button onClick={handleNext}>
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