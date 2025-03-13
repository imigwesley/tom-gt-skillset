import { Card, CardContent, Divider, Typography } from "@mui/material";
import './MemberInfoCard.scss';
import clsx from 'clsx';
import { MemberCardProps } from '../../Types/props';


const MemberInfoCard = ({member, isEven, isFirst, isLast}: MemberCardProps) => {
  return (
    <div>
      <Card square elevation={0} className={clsx(isEven ? 'light' : 'dark', isFirst ? 'first' : isLast ? 'last' : '')}>
        <CardContent className='member-card-content'>
          <Typography className='table-section-simple'>{member.identifiers.name}</Typography>
          {/* <Typography className='table-section'>{member.teams.teamMembership}</Typography> */}
          <Typography sx={{fontStyle: 'italic'}} className='table-section-simple'>{member.roles.role}</Typography>
          <Typography className='table-section-wide'>{member.identifiers.accountEmail + (member.identifiers.otherEmails.length > 0 ? ', ' + member.identifiers.otherEmails.join(', ') : '')}</Typography>
          {/* <Typography className='table-section-simple'>
            {member.teams.teamsAdvising.length > 0 &&
              'Advising: ' + member.teams.teamsAdvising.reduce((acc, team, index) => {return acc + (index > 0 ? ', ' : '') + team})
            }
            </Typography> */}
        </CardContent>
      </Card>
      {/* {!isLast && <Divider />} */}
    </div>
  );
}

export default MemberInfoCard;