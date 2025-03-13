import { CheckCircleOutline, HighlightOff, RadioButtonUncheckedOutlined, TaskAlt } from '@mui/icons-material';
import './SubsectionLink.scss';
import { Typography } from '@mui/material';
import { SubsectionLinkProps } from '../../Types/props';

const SubsectionLink = ({isApproved, name, isCurrent, index, hasDeliverable}: SubsectionLinkProps) => {

  return (
    <div className={`link-container ${isCurrent ? 'current' : ''}`} >
      <Typography variant='body1'>{(index + 1) + ') '}</Typography>
      <Typography variant='body1' className='link'>{name}</Typography>
      <div style={{flexGrow: 1}} />
      {hasDeliverable && (isApproved === undefined ?
        <RadioButtonUncheckedOutlined fontSize='small' />
      : isApproved ?
        <CheckCircleOutline fontSize='small'/>
      :
        <HighlightOff fontSize='small' />
      )}
    </div>
  );
}

export default SubsectionLink;