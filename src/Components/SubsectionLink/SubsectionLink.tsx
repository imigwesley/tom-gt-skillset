import { CheckCircleOutline, RadioButtonUncheckedOutlined, TaskAlt } from '@mui/icons-material';
import './SubsectionLink.scss';
import { Typography } from '@mui/material';

interface SubsectionLinkProps {
  isCompleted: boolean,
  name: string,
  isCurrent: boolean,
  index: number
}

const SubsectionLink = ({isCompleted, name, isCurrent, index}: SubsectionLinkProps) => {

  return (
    <div className={`link-container ${isCurrent ? 'current' : ''}`} >
      <Typography variant='body1'>{(index + 1) + ') '}</Typography>
      <Typography variant='body1' className='link'>{name}</Typography>
      <div style={{flexGrow: 1}} />
      {isCompleted
      ?
        <TaskAlt fontSize='small'/>
      :
        <RadioButtonUncheckedOutlined fontSize='small' />
      }
    </div>
  );
}

export default SubsectionLink;