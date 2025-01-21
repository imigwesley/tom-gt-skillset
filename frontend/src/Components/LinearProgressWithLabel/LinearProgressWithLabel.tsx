import './LinearProgressWithLabel.scss';
import * as React from 'react';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// import Box from '@mui/material/Box';

// function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//       <Box sx={{ width: '100%', mr: 1 }}>
//         <LinearProgress variant="determinate" {...props} />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography
//           variant="body2"
//           sx={{ color: 'text.secondary' }}
//         >{`${Math.round(props.value)}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }

// export default function LinearWithValueLabel() {
  

//   return (
//     <Box sx={{ width: '100%' }}>
//       <LinearProgressWithLabel value={progress} />
//     </Box>
//   );
// }
interface LinearProgressWithLabelProps {
  progress: number
}


const LinearProgressWithLabel = ({progress}: LinearProgressWithLabelProps) => {

  return (
    <div className='progress-container'>
      <LinearProgress variant='determinate' value={progress} className='progress-bar'/>
      <Typography>
        {progress}%
      </Typography>
    </div>
  )
}

export default LinearProgressWithLabel;
