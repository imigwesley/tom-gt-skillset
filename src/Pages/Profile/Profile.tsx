import { Typography } from "@mui/material";
import './Profile.scss';
import { MemberInformation, PageProps } from '../../Types/types';
import { useEffect, useState } from "react";
import { getSingleUserData } from "../../utils/userApi";

const ProfilePage = ({loggedInUser}: PageProps) => {

  const [currUser, setCurrUser] = useState<MemberInformation>({
    identifiers: {
      userID: '',
      accountEmail: '',
      name: '',
      gtID: '',
      contactEmails: ['']
    },
    roles: {
      role: '',
      isAdmin: false
    },
    teams: {
      teamMembership: [''],
      teamsAdvising: ['']
    },
    moduleProgress: [{
      moduleName: '',
      percentComplete: 0.0,
      isAssigned: false,
      subsectionsComplete: []
    }]
  });

  useEffect(() => {
    const tempCurrUser = getSingleUserData(loggedInUser?.userId);
    setCurrUser(tempCurrUser);
  }, [])

  return (
    <div className='profile-container'>
      <Typography variant='h2' className="header">Your Profile</Typography>

      <div className="background-card">
        <Typography variant="h5" className="info-name">Name:</Typography>
        <Typography className="info">{currUser.identifiers.name}</Typography>

        <Typography variant="h5"  className="info-name">Primary Email:</Typography>
        <Typography className="info">{currUser.identifiers.contactEmails[0]}</Typography>

        {currUser.identifiers.contactEmails.length > 1 &&
          <div>
            <Typography variant="h5" className="info-name">Other emails</Typography>
              {currUser.identifiers.contactEmails.map((_email, index) => {
                if (index > 0) {
                  return (
                    <Typography className="info">{currUser.identifiers.contactEmails[index]}</Typography>
                  )
                }
              })}
          </div>
        }
        
        <Typography variant="h5" className="info-name">Team:</Typography>
        <Typography className="info">{currUser.teams.teamMembership}</Typography>

        <Typography variant="h5" className="info-name">Advising:</Typography>
        <Typography className="info">{currUser.teams.teamsAdvising.length > 1 ? currUser.teams.teamsAdvising : 'No teams advising'}</Typography>

        <Typography variant="h5" className="info-name">Role:</Typography>
        <Typography className="info">{currUser.roles.role}</Typography>

        <Typography variant="h5" className="info-name">Section Progress:</Typography>
        <div>
          {currUser.moduleProgress.map((module) => {
            return (
              <div>
                <Typography className="info-name">Module:</Typography>
                <Typography className="info">{module.moduleName}</Typography>

                <Typography className="info-name">Percent Complete:</Typography>
                <Typography className="info">{module.percentComplete}</Typography>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;