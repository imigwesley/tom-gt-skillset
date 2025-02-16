import { Button, TextField, Typography } from '@mui/material';
import './Contact.scss';
import { useEffect, useState } from 'react';
import { MemberInformation, PageProps } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';

const FeedbackPage = ({loggedInUser}: PageProps) => {

  const [firstFeedback, setFirstFeedback] = useState('');
  const [secondFeedback, setSecondFeedback] = useState('');
  const [currUser, setCurrUser] = useState<MemberInformation>({
    userId: '',
    identifiers: {
      accountEmail: '',
      name: '',
      gtID: '',
      otherEmails: ['']
    },
    roles: {
        role: '',
        isAdmin: false
    },
    teams: {
        teamMembership: [''],
        teamsAdvising: ['']
    },
    moduleProgress: [{
        moduleName: '',
        percentComplete: 0.0,
        isAssigned: false,
        subsectionsComplete: []
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setCurrUser(tempCurrUser);
    }
    fetchData();
  }, [])

  const handleFirstInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstFeedback(event.target.value);
  }

  const handleSecondInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecondFeedback(event.target.value);
  }

  const handleSubmitFeedback = () => {
    console.log('made it');
    console.log(firstFeedback + secondFeedback);
    console.log('should be emailing feedback to: ', currUser.identifiers.accountEmail);
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