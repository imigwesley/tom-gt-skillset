import { CheckCircleOutline, RadioButtonUncheckedOutlined, TaskAlt } from '@mui/icons-material';
import './SubsectionLink.scss';
import { Typography } from '@mui/material';

interface SubsectionLinkProps {
  isCompleted: boolean,
  name: string,
  isCurrent: boolean,
}

const SubsectionLink = ({isCompleted, name, isCurrent}: SubsectionLinkProps) => {

  return (
    <div className='link-container'>
      <Typography variant='body1' className={`${isCurrent ? 'current' : ''}`}>{name}</Typography>
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