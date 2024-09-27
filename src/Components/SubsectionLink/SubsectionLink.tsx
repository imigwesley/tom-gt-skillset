import { CheckCircleOutline, RadioButtonUncheckedOutlined } from '@mui/icons-material';
import './SubsectionLink.scss';
import { Typography } from '@mui/material';

interface SubsectionLinkProps {
  isCompleted: boolean,
  name: string
}

const SubsectionLink = ({isCompleted, name}: SubsectionLinkProps) => {

  return (
    <div className='link-container'>
      {isCompleted
      ?
        <CheckCircleOutline />
      :
        <RadioButtonUncheckedOutlined />
      }
      <Typography variant='body2'>{name}</Typography>
    </div>
  );
}

export default SubsectionLink;