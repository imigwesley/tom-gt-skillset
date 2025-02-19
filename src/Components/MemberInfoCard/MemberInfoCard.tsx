import { Card, CardContent, Divider, Typography } from "@mui/material";
import './MemberInfoCard.scss';
import clsx from 'clsx';
import { MemberCardProps } from '../../Types/props';


const MemberInfoCard = ({member, isEven, isFirst, isLast}: MemberCardProps) => {
  return (
    <div>
      <Card square elevation={0} className={clsx(isEven ? 'light' : 'dark', isFirst ? 'first' : isLast ? 'last' : '')}>
        <CardContent className='member-card-content'>
          <Typography className='table-section'>{member.identifiers.name}</Typography>
          {/* <Typography className='table-section'>{member.teams.teamMembership}</Typography> */}
          <Typography sx={{fontStyle: 'italic'}} className='table-section'>{member.roles.role}</Typography>
          <Typography className='table-section-wide'>{member.identifiers.otherEmails[0]}</Typography>
          <Typography className='table-section'>
            {member.teams.teamsAdvising.length > 0 &&
              'Advising: ' + member.teams.teamsAdvising.reduce((acc, team, index) => {return acc + (index > 0 ? ', ' : '') + team})
            }
            </Typography>
        </CardContent>
      </Card>
      {/* {!isLast && <Divider />} */}
    </div>
  );
}

export default MemberInfoCard;