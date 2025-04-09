import { Alert, Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import './Profile.scss';
import { MemberInformation, ResponseInfo } from '../../Types/types';
import { useEffect, useState } from "react";
import { getSingleUserData } from "../../utils/userApi";
import { PageProps } from "../../Types/props";
import { getAllActivities } from "../../utils/activityApi";
import { getAllSubsections } from "../../utils/subsectionsApi";
import { Edit } from "@mui/icons-material";
import { Operations, SubmissionStatus } from "../../Types/enums";
import AdminModal from "../../Components/AdminModal/AdminModal";
import { getSubmission } from "../../utils/submissionApi";

const ProfilePage = ({loggedInUser}: PageProps) => {

  const [editUserProfile, setEditUserProfile] = useState<boolean>(false);
  const [rerenderKey, setRerenderkey] = useState(0);
  const [progressData, setProgressData] = useState<{ activityName: string; percentComplete: number; completedNames: string[] }[]>([{
    activityName: 'temp',
    percentComplete: 0.0,
    completedNames: []
  }]);
  const [responseInfo, setResponseInfo] = useState<ResponseInfo>(
    {
      waiting: false, 
      response: {
        isSuccess: null, 
        message: ''
      }
    }
  );
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
    progress: [{
      activityName: '',
      subsectionProgress: []
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      const tempAllActivities = await getAllActivities();
      const tempAllSubsections = await getAllSubsections();
  
      setCurrUser(tempCurrUser);
      if (!tempCurrUser.progress) return;
  
      const updatedProgress = await Promise.all(
        tempCurrUser.progress.map(async (activity) => {
          const relevantSubsections =
            tempAllActivities.find((act) => act.activityName === activity.activityName)?.subsectionNames || [];
          const numWithDeliverable = tempAllSubsections?.filter(
            (sub) => sub.hasDeliverable && relevantSubsections.includes(sub.subsectionName)
          ).length || 0;
  
          const completedSubs = activity.subsectionProgress;
  
          // find num/names of most recent submissions that have been approved
          const completedResults = await Promise.all(
            completedSubs.map(async (subRecord) => {
              const latestSubmissionId = subRecord.submissionIds[subRecord.submissionIds.length - 1];
              const latestSubmissionInfo = await getSubmission(latestSubmissionId);
          
              if (!latestSubmissionInfo || latestSubmissionInfo.length === 0) {
                console.error(`getSubmission returned undefined or empty array for ID: ${latestSubmissionId}`);
                return { status: SubmissionStatus.REJECTED, subsection: subRecord.subsection };
              }
          
              const status = latestSubmissionInfo[0].status === SubmissionStatus.APPROVED;
              return { status, subsection: subRecord.subsection };
            })
          );
          
          const numCompleted = completedResults.filter((result) => result.status === true).length;
          
          const completedNames = completedResults
            .filter((result) => result.status === true)
            .map((result) => result.subsection);
          const percentComplete = numCompleted ? Math.round((numCompleted / numWithDeliverable) * 100) : 0;
  
          return {
            activityName: activity.activityName,
            percentComplete,
            completedNames,
          };
        })
      );
      setProgressData(updatedProgress);
    };
  
    fetchData();
  }, [loggedInUser, rerenderKey]);
  
  const handleResponseProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
  }

  const handleCloseModal = () => {
    setEditUserProfile(false);
    setRerenderkey(rerenderKey + 1);
  }

  return (
    <>

    <div className='profile-container'>
      <Typography variant='h3' className="header">Your Profile</Typography>

      <div className="background-card">
      {progressData[0]?.activityName === 'temp' ?
        <CircularProgress style={{margin: '0% 46%'}} />
      
    : <>
        { editUserProfile && 
          <AdminModal 
            currentOperation={Operations.EDIT_SELF} 
            closeModal={handleCloseModal} 
            currentUser={currUser} 
            passResponseProgress={handleResponseProgress} 
          />
        }
        <div className="name-and-edit">
          <Typography variant="h6" className="info-name">Name:</Typography>
          <Button 
            className="button" 
            disableRipple 
            size="small" 
            variant="contained"
            onClick={() => setEditUserProfile(true)}
          >
            <Edit fontSize="small" />
            Edit profile
          </Button>
        </div>
        <Typography className="info">{currUser.identifiers.name}</Typography>

        <Typography variant="h6"  className="info-name padded">Primary Email:</Typography>
        <Typography className="info">{currUser.identifiers.accountEmail}</Typography>

        {currUser.identifiers.otherEmails.length > 0 &&
          <div>
            <Typography variant="h6" className="info-name padded">Other emails:</Typography>
              {currUser.identifiers.otherEmails.map((_email, index) => (
                <Typography key={index} className="info">{currUser.identifiers.otherEmails[index]}</Typography>
              ))}
          </div>
        }
        
        {/* <Typography variant="h5" className="info-name">Team:</Typography>
        <Typography className="info">{currUser.teams.teamMembership}</Typography>

        <Typography variant="h5" className="info-name">Advising:</Typography>
        <Typography className="info">{currUser.teams.teamsAdvising.length > 1 ? currUser.teams.teamsAdvising : 'No teams advising'}</Typography> */}

        <Typography variant="h6" className="info-name padded">Role:</Typography>
        <Typography className="info">{currUser.roles.role}</Typography>

        <Typography variant="h6" className="info-name padded">Section Progress:</Typography>
        {currUser?.progress?.length > 0 ?
          <div>
            <Table className="table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-cell"><Typography variant="subtitle1" fontWeight="bold">Activity Name</Typography></TableCell>
                  <TableCell className="table-cell"><Typography variant="subtitle1" fontWeight="bold">Percent Complete</Typography></TableCell>
                  <TableCell className="table-cell"><Typography variant="subtitle1" fontWeight="bold">Subsections Complete</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {progressData.map((activity) => (
                  <TableRow key={activity.activityName}>
                    <TableCell>{activity.activityName}</TableCell>
                    <TableCell>{activity.percentComplete}%</TableCell>
                    <TableCell>{activity.completedNames.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          : 
          <Typography className="info">
            No progress yet.
          </Typography>
        }
        </>}
      </div>
    </div>
      {responseInfo.response.isSuccess !== null &&
        <div className='feedback-container'>
          <Alert className='feedback' severity={responseInfo.response.isSuccess ? 'success' : 'error'}>{responseInfo.response.message}</Alert>
        </div>
      }
    </>
  );
};

export default ProfilePage;