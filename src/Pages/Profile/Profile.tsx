import { Button, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import './Profile.scss';
import { MemberInformation } from '../../Types/types';
import { useEffect, useState } from "react";
import { getSingleUserData } from "../../utils/userApi";
import { PageProps } from "../../Types/props";
import { getAllActivities } from "../../utils/activityApi";
import { getAllSubsections } from "../../utils/subsectionsApi";
import { Edit } from "@mui/icons-material";
import { Operations } from "../../Types/enums";
import AdminModal from "../../Components/AdminModal/AdminModal";
import { getSubmission } from "../../utils/submissionApi";

const ProfilePage = ({loggedInUser}: PageProps) => {

  const [editUserProfile, setEditUserProfile] = useState<boolean>(false);
  const [progressData, setProgressData] = useState<{ activityName: string; percentComplete: number; completedNames: string[] }[]>([]);
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
                return { isApproved: false, subsection: subRecord.subsection };
              }
          
              const isApproved = latestSubmissionInfo[0].isApproved === true;
              return { isApproved, subsection: subRecord.subsection };
            })
          );
          
          const numCompleted = completedResults.filter((result) => result.isApproved).length;
          
          const completedNames = completedResults
            .filter((result) => result.isApproved)
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
  }, [loggedInUser]);
  

  return (
    <>

    <div className='profile-container'>
      <Typography variant='h3' className="header">Your Profile</Typography>

      <div className="background-card">
      {currUser.userId === '' ?
        <CircularProgress style={{margin: '0% 46%'}} />
      
    : <>
        { editUserProfile && <AdminModal currentOperation={Operations.EDIT_SELF} closeModal={() => setEditUserProfile(false)} currentUser={currUser} />}
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

        {currUser.identifiers.otherEmails.length > 1 &&
          <div>
            <Typography variant="h6" className="info-name padded">Other emails:</Typography>
              {currUser.identifiers.otherEmails.map((_email, index) => {
                if (index > 0) {
                  return (
                    <Typography className="info">{currUser.identifiers.otherEmails[index]}</Typography>
                  )
                }
              })}
          </div>
        }
        
        {/* <Typography variant="h5" className="info-name">Team:</Typography>
        <Typography className="info">{currUser.teams.teamMembership}</Typography>

        <Typography variant="h5" className="info-name">Advising:</Typography>
        <Typography className="info">{currUser.teams.teamsAdvising.length > 1 ? currUser.teams.teamsAdvising : 'No teams advising'}</Typography> */}

        <Typography variant="h6" className="info-name padded">Role:</Typography>
        <Typography className="info">{currUser.roles.role}</Typography>

        <Typography variant="h6" className="info-name padded">Section Progress:</Typography>
        {currUser.progress ?
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
          <div>
            No progress yet.
          </div>
        }
        </>}
      </div>
    </div>
    </>
  );
};

export default ProfilePage;