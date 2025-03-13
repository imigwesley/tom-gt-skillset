import './LinearProgressWithLabel.scss';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

interface LinearProgressWithLabelProps {
  progress: number
}

const LinearProgressWithLabel = ({progress}: LinearProgressWithLabelProps) => {

  return (
    <div className='progress-container'>
      <LinearProgress variant='determinate' value={progress} className='progress-bar'/>
      <Typography>
        {progress}% complete
      </Typography>
    </div>
  )
}

export default LinearProgressWithLabel;
