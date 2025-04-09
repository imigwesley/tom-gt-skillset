import { Adjust, CheckCircleOutline, HighlightOff, RadioButtonUncheckedOutlined, TaskAlt } from '@mui/icons-material';
import './SubsectionLink.scss';
import { Typography } from '@mui/material';
import { SubsectionLinkProps } from '../../Types/props';
import { SubmissionStatus } from '../../Types/enums';

const SubsectionLink = ({status, name, isCurrent, index, hasDeliverable}: SubsectionLinkProps) => {

  return (
    <div className={`link-container ${isCurrent ? 'current' : ''}`} >
      <Typography variant='body1'>{(index + 1) + ') '}</Typography>
      <Typography variant='body1' className='link'>{name}</Typography>
      <div style={{flexGrow: 1}} />
      {hasDeliverable && (status === SubmissionStatus.REJECTED ?
        <HighlightOff fontSize='small' />
      : status === SubmissionStatus.PENDING ?
        <Adjust fontSize='small' />
      : status === SubmissionStatus.APPROVED ?
        <CheckCircleOutline fontSize='small'/>
      :
        <RadioButtonUncheckedOutlined fontSize='small' />
      )}
    </div>
  );
}

export default SubsectionLink;