import { Button, TextField, Typography } from '@mui/material';
import './Contact.scss';
import { useState } from 'react';

const FeedbackPage = () => {

  const [firstFeedback, setFirstFeedback] = useState('');
  const [secondFeedback, setSecondFeedback] = useState('');

  const handleFirstInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstFeedback(event.target.value);
  }

  const handleSecondInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecondFeedback(event.target.value);
  }

  const handleSubmitFeedback = () => {
    console.log('made it');
    console.log(firstFeedback + secondFeedback);
    setFirstFeedback('');
    setSecondFeedback('');
    alert('Feedback submitted!'); // or something else like make the button green
  }

    return (
      <div className='contact-container'>
        <Typography variant='h2'>
          Contact Us/Site Feedback
        </Typography>
        <div className='question-section'>
          <Typography variant='h4'>
            What did you think?
          </Typography>
          <TextField multiline fullWidth rows={4} onChange={handleFirstInputChange} value={firstFeedback} className='input-section'/>
        </div>
        <div className='question-section'>
          <Typography variant='h4'>
            What would you change?
          </Typography>
          <TextField multiline fullWidth rows={3} onChange={handleSecondInputChange} value={secondFeedback} className='input-section'/>
        </div>
        <Button variant='contained' disableRipple onClick={handleSubmitFeedback}>
          submit
        </Button>
      </div>
    );
  };
  
  export default FeedbackPage;