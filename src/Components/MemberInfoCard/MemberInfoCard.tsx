import { Card, CardContent, Divider, Typography } from "@mui/material";
import './MemberInfoCard.scss';

interface Member {
  name: string,
  email: string,
  teamMembership: string,
  teamsAdvising: string[],
  role: string,
  isExec: boolean,
}

interface MemberCardProps {
  member: Member,
  isEven: boolean
}

const MemberInfoCard = ({member, isEven}: MemberCardProps) => {
  return (
    <div>
      <Card square elevation={0} className={isEven ? 'light' : 'dark'}>
        <CardContent className='card-content'>
          <Typography className='table-section'>{member.name}</Typography>
          <Typography className='table-section'>{member.teamMembership}</Typography>
          <Typography sx={{fontStyle: 'italic'}} className='table-section'>{member.role}</Typography>
          <Typography className='table-section'>{member.email}</Typography>
          <Typography className='table-section'>
            {member.teamsAdvising.length > 0 &&
              'Advising: ' + member.teamsAdvising.reduce((acc, team, index) => {return acc + (index > 0 ? ', ' : '') + team})
            }
            </Typography>
        </CardContent>
      </Card>
      <Divider />
    </div>
  );
}

export default MemberInfoCard;