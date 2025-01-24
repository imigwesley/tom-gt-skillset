import { Typography } from "@mui/material";
import './Profile.scss';
import { PageProps } from '../../Types/types';

const ProfilePage = ({user}: PageProps) => {

  const placeholderuser = {
    name: 'Matthew Hall',
    email: ['matthew.hall@gatech.edu', 'matthall@gmail.com'],
    teamMembership: 'Design',
    teamsAdvising: ['Marketing'],
    role: 'member',
    isExec: false,
    moduleProgress: [
      {
        moduleName: 'CAD',
        percentComplete: 69.5
      }
    ]
  };

    return (
      <div className='profile-container'>
        <Typography variant='h2' className="header">Your Profile</Typography>

        <div className="background-card">
          <Typography variant="h5" className="info-name">Name:</Typography>
          <Typography className="info">{placeholderuser.name}</Typography>

          <Typography variant="h5"  className="info-name">Primary Email:</Typography>
          <Typography className="info">{placeholderuser.email[0]}</Typography>

          {placeholderuser.email.length > 1 &&
            <div>
              <Typography variant="h5" className="info-name">Other emails</Typography>
                {placeholderuser.email.map((_email, index) => {
                  if (index > 0) {
                    return (
                      <Typography className="info">{placeholderuser.email[index]}</Typography>
                    )
                  }
                })}
            </div>
          }
          
          <Typography variant="h5" className="info-name">Team:</Typography>
          <Typography className="info">{placeholderuser.teamMembership}</Typography>

          <Typography variant="h5" className="info-name">Advising:</Typography>
          <Typography className="info">{placeholderuser.teamsAdvising.length > 1 ? placeholderuser.teamsAdvising : 'No teams advising'}</Typography>

          <Typography variant="h5" className="info-name">Role:</Typography>
          <Typography className="info">{placeholderuser.role}</Typography>

          <Typography variant="h5" className="info-name">Section Progress:</Typography>
          <div>
            {placeholderuser.moduleProgress.map((module) => {
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