import { Typography } from "@mui/material";

const ProfilePage = () => {

  const user = {
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
        <div>
          <Typography variant='h2'>Your Profile</Typography>
          <Typography variant="h5">Name:</Typography>
          <Typography>{user.name}</Typography>
          <Typography variant="h5">Primary Email:</Typography>
          <Typography>{user.email[0]}</Typography>
          {user.email.length > 1 &&
            <div>
              <Typography variant="h5">Other emails</Typography>
                {user.email.map((_email, index) => {
                  if (index > 0) {
                    return (
                      <Typography>{user.email[index]}</Typography>
                    )
                  }
                })}
            </div>
          }
          
          <Typography variant="h5">Team:</Typography>
          <Typography>{user.teamMembership}</Typography>
          <Typography variant="h5">Advising:</Typography>
          <Typography>{user.teamsAdvising.length > 1 ? user.teamsAdvising : 'No teams advising'}</Typography>
          <Typography variant="h5">Role:</Typography>
          <Typography>{user.role}</Typography>
          <Typography variant="h5">Section Progress:</Typography>
          <div>
            {user.moduleProgress.map((module) => {
              return (
                <div>
                  <Typography>Module:</Typography>
                  <Typography>{module.moduleName}</Typography>
                  <Typography>Percent Complete:</Typography>
                  <Typography>{module.percentComplete}</Typography>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfilePage;