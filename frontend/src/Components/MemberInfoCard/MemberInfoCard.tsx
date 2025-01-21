import { Card, CardContent, Divider, Typography } from "@mui/material";
import './MemberInfoCard.scss';
import clsx from 'clsx';

interface Member {
  name: string,
  email: string[],
  teamMembership: string[],
  teamsAdvising: string[],
  role: string,
  isExec: boolean,
}

interface MemberCardProps {
  member: Member,
  isEven: boolean,
  isFirst: boolean,
  isLast: boolean
}

const MemberInfoCard = ({member, isEven, isFirst, isLast}: MemberCardProps) => {
  return (
    <div>
      <Card square elevation={0} className={clsx(isEven ? 'light' : 'dark', isFirst ? 'first' : isLast ? 'last' : '')}>
        <CardContent className='member-card-content'>
          <Typography className='table-section'>{member.name}</Typography>
          <Typography className='table-section'>{member.teamMembership}</Typography>
          <Typography sx={{fontStyle: 'italic'}} className='table-section'>{member.role}</Typography>
          <Typography className='table-section-wide'>{member.email[0]}</Typography>
          <Typography className='table-section'>
            {member.teamsAdvising.length > 0 &&
              'Advising: ' + member.teamsAdvising.reduce((acc, team, index) => {return acc + (index > 0 ? ', ' : '') + team})
            }
            </Typography>
        </CardContent>
      </Card>
      {/* {!isLast && <Divider />} */}
    </div>
  );
}

export default MemberInfoCard;