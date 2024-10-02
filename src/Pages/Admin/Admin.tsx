import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Modal, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import './Admin.scss';
import { useState } from 'react';
import React from 'react';

const AdminPage = () => {

  enum Operations {
    NULL = 'NULL',
    ADD_USER = 'ADD_USER',
    EDIT_USER = 'EDIT_USER',
    DELETE_USER = 'DELETE_USER',
    ADD_TEAM = 'ADD_TEAM',
    EDIT_TEAM = 'EDIT_TEAM',
    DELETE_TEAM = 'DELETE_TEAM',
    ADD_SUBSECTION = 'ADD_SUBSECTION',
    EDIT_SUBSECTION = 'EDIT_SUBSECTION',
    DELETE_SUBSECTION = 'DELETE_SUBSECTION',
    ADD_MODULE = 'ADD_MODULE',
    EDIT_MODULE = 'EDIT_MODULE',
    DELETE_MODULE = 'DELETE_MODULE',
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [currentOperation, setCurrentOperation] = useState<Operations>(Operations.NULL);
  
  const stepSets: Record<Operations, string[]> = {
    [Operations.NULL]: [''],
    [Operations.ADD_USER]: ['Input User Information', 'Confirm'],
    [Operations.EDIT_USER]: ['Select User', 'Input User Information', 'Confirm'],
    [Operations.DELETE_USER]: ['Select User', 'Confirm Choice'],
  
    [Operations.ADD_TEAM]: ['Input Team Details', 'Confirm'],
    [Operations.EDIT_TEAM]: ['Select Team', 'Edit Team Details', 'Confirm'],
    [Operations.DELETE_TEAM]: ['Select Team', 'Confirm Choice'],
  
    [Operations.ADD_SUBSECTION]: ['Input Subsection Details', 'Confirm'],
    [Operations.EDIT_SUBSECTION]: ['Select Subsection', 'Edit Subsection Details', 'Confirm'],
    [Operations.DELETE_SUBSECTION]: ['Select Subsection', 'Confirm Choice'],
  
    [Operations.ADD_MODULE]: ['Input Module Details', 'Confirm'],
    [Operations.EDIT_MODULE]: ['Select Module', 'Edit Module Details', 'Confirm'],
    [Operations.DELETE_MODULE]: ['Select Module', 'Confirm Choice'],
  };

  const handleOpenModal = (entity: Operations) => {
    console.log(entity);
    setCurrentOperation(entity);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    handleReset();
    setCurrentOperation(Operations.NULL);
  }

  const handleNext = () => {
    if (activeStep === stepSets[currentOperation].length - 1) {
      handleCloseModal(); // Close the modal when on the last step
      // TODO: add here the api call
      // TODO: turn on spinner while waiting on api response
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
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
          open={isModalOpen}
          onClose={handleCloseModal}
          transitionDuration={0}
        >
          <Box className={'modal'}>
            <Stepper activeStep={activeStep}>
              {stepSets[currentOperation].map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
              <div>
                <div className='modal-content'>
                  <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                  <div style={{width: '570px', height: '450px'}} />
                </div>
                

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
                    {activeStep === stepSets[currentOperation].length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>

              </div>
          </Box>
        </Dialog>

      </div>
    );
  };
  
  export default AdminPage;