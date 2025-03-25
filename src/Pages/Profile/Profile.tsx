import { Typography } from "@mui/material";
import './Profile.scss';
import { ActivityInformation, MemberInformation, SubsectionInformation } from '../../Types/types';
import { useEffect, useState } from "react";
import { getSingleUserData } from "../../utils/userApi";
import { PageProps } from "../../Types/props";
import { getAllActivities } from "../../utils/activityApi";
import { getAllSubsections } from "../../utils/subsectionsApi";

const ProfilePage = ({loggedInUser}: PageProps) => {

  const [allActivities, setAllActivities] = useState<ActivityInformation[]>([]);
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
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
      setAllActivities(tempAllActivities);
      setAllSubsections(tempAllSubsections);
    }
    fetchData();
  }, [])

  return (
    <div className='profile-container'>
      <Typography variant='h2' className="header">Your Profile</Typography>

      <div className="background-card">
        <Typography variant="h5" className="info-name">Name:</Typography>
        <Typography className="info">{currUser.identifiers.name}</Typography>

        <Typography variant="h5"  className="info-name">Primary Email:</Typography>
        <Typography className="info">{currUser.identifiers.accountEmail}</Typography>

        {currUser.identifiers.otherEmails.length > 1 &&
          <div>
            <Typography variant="h5" className="info-name">Other emails:</Typography>
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

        <Typography variant="h5" className="info-name">Role:</Typography>
        <Typography className="info">{currUser.roles.role}</Typography>

        <Typography variant="h5" className="info-name">Section Progress:</Typography>
        {currUser.progress ?
        <div>
          {currUser.progress?.map((activity) => {
              const relevantSubsections = allActivities.find((act) => act.activityName === activity.activityName)?.subsectionNames || [];
              const numSubsections = allSubsections?.filter((sub)=> (sub.hasDeliverable && (relevantSubsections.includes(sub.subsectionName)))).length || 0;              const numCompleted = activity.subsectionProgress.length || 0.0;
              const percentComplete = numCompleted ? Math.round((numCompleted / numSubsections) * 100) : 0.0;
              
            return (
              <div>
                <Typography className="info-name">Activity Name:</Typography>
                <Typography className="info">{activity.activityName}</Typography>

                <Typography className="info-name">Percent Complete:</Typography>
                <Typography className="info">{percentComplete}%</Typography>
              </div>
            )
          })}
        </div>
        : 
        <div>
          'NONE'
        </div>
        }
      </div>
    </div>
  );
};

export default ProfilePage;