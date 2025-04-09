import { Alert, Backdrop, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material';
import './Admin.scss';
import '../../Feedback.scss';
import { useState } from 'react';
import { Operations } from '../../Types/enums';
import AdminModal from '../../Components/AdminModal/AdminModal';
import { ResponseInfo } from '../../Types/types';


const AdminPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currOperation, setCurrOperation] = useState<Operations>(Operations.NULL);
  const [responseInfo, setResponseInfo] = useState<ResponseInfo>(
    {
      waiting: false, 
      response: {
        isSuccess: null, 
        message: ''
      }
    }
  );

  const handleOpenModal = (entity: Operations) => {
    setCurrOperation(entity);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    // setInvalidapiDataToSend(false);
    // handleReset();
    setCurrOperation(Operations.NULL);
  }

  const handleResponseProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
  }

  return (
    <div className='admin-container'>
      <div className='page-section'>
        <Typography variant='h4' className='section-header'>User Actions</Typography>
        <Paper className='calls-surface'>
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Edit User</Typography>
              <Typography variant='subtitle2' className='subtitle'>Edit user profile (name, contact methods)</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.EDIT_USER)}>Edit User</Button>
          </div>
          <Divider variant='middle'/>
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Delete User</Typography>
              <Typography variant='subtitle2' className='subtitle'>Delete user profile and account</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.DELETE_USER)}>Delete User</Button>
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
              <Typography variant='h6'>Create Activity Subsection</Typography>
              <Typography variant='subtitle2' className='subtitle'>Creates a new activity subsection. </Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.ADD_SUBSECTION)}>Create Activity Subsection</Button>
          </div>
          <Divider variant='middle' />
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Edit Activity Subsection</Typography>
              <Typography variant='subtitle2' className='subtitle'>Edit an existing activity subsection</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.EDIT_SUBSECTION)}>Edit Activity Subsection</Button>
          </div>
          <Divider variant='middle'/>
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Delete Activity Subsection</Typography>
              <Typography variant='subtitle2' className='subtitle'>Delete a subsection and remove it from all associated activities</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.DELETE_SUBSECTION)}>Delete Activity Subsection</Button>
          </div>
          <Divider variant='middle' />
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Create Activity</Typography>
              <Typography variant='subtitle2' className='subtitle'>Create an activity and include subsections</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.ADD_ACTIVITY)}>Create Activity</Button>
          </div>
          <Divider variant='middle' />
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Edit Activity</Typography>
              <Typography variant='subtitle2' className='subtitle'>Edit an existing activity</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.EDIT_ACTIVITY)}>Edit Activity</Button>
          </div>
          <Divider variant='middle'/>
          <div className='call-section'>
            <div>
              <Typography variant='h6'>Delete Activity</Typography>
              <Typography variant='subtitle2' className='subtitle'>Delete an activity</Typography>
            </div>
            <Button disableRipple variant='contained' onClick={() => handleOpenModal(Operations.DELETE_ACTIVITY)}>Delete Activity</Button>
          </div>
        </Paper>
      </div>
      {showModal && <AdminModal currentOperation={currOperation} closeModal={handleCloseModal} passResponseProgress={handleResponseProgress}/>}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={responseInfo.waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {responseInfo.response.isSuccess !== null &&
        <div className='feedback-container'>
          <Alert className='feedback' severity={responseInfo.response.isSuccess ? 'success' : 'error'}>{responseInfo.response.message}</Alert>
        </div>
      }

    </div>
  );
};

export default AdminPage;