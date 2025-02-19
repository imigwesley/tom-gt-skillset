import { Divider, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TrainingActivities.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
import subSectionsSample from '../../SampleData/SubsectionsSample';
import { ActivityProgress, MemberInformation, ActivityInformation } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
import activitiesSample from '../../SampleData/ActivitiesSample';
import { PageProps } from '../../Types/props';

const TrainingModulesPage = ({loggedInUser}: PageProps) => {
  const { activityName } = useParams();
  const [activity, setActivity] = useState<ActivityInformation>({
    isTeam: false,
    isIndividual: false,
    activityName: '',
    subsectionNames: [],
    imageURL: ''
  });
  const [subsectionHtml, setSubsectionHtml] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currSubsection, setCurrSubsection] = useState('');
  const [subsections, setSubsections] = useState(['']);
  const [memberProgress, setMemberProgress] = useState<ActivityProgress[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setActivity(activitiesSample[0]); // change to last completed one
      setSubsections(activity.subsectionNames);
      const curr = activity.subsectionNames[0];
      setCurrSubsection(curr);
      setSubsectionHtml(subSectionsSample.find((subsection) => subsection.subsectionName === curr)?.subsectionHtml || '');
      setMemberProgress(tempCurrUser.progress);
      setIsLoading(false);
    };

    setIsLoading(true);
    fetchData();
  }, [activityName, activity]);


  const handleSubsectionClick = (passedSubsection: string) => {
    console.log(passedSubsection);
    setCurrSubsection(passedSubsection);
    setSubsectionHtml(subSectionsSample.find((subsection) => subsection.subsectionName === passedSubsection)?.subsectionHtml || '')
  }

    return (
      <div>      
        {isLoading ?
          <div style={{padding:'200px', width:'300px', margin:'auto'}}>
            <LinearProgress />
          </div>
        :
          <div className='activity-page-container'>
              <div className='background-card'>
                <Typography variant='h4'>{activityName}</Typography>
                {subsections.map((subsection, index) => {
                  return (
                    <div key={index} onClick={() => handleSubsectionClick(subsection)}>
                      <SubsectionLink 
                        isCurrent={currSubsection === subsection} 
                        isCompleted={memberProgress?.find((curr) => curr.activityName === activityName)?.subsectionsComplete.includes(subsection) ? true : false} 
                        name={subsection} 
                      />
                    </div>
                  );
                })}
              </div>

              <div className='activity-container background-card'>
                <Typography variant='h3'>{currSubsection}</Typography>
                <Divider variant='middle' />
                <div className='quill'>
                  <div className='ql-snow'>
                    <div className='ql-editor' dangerouslySetInnerHTML={{__html: subsectionHtml || ''}}/>
                  </div>
                </div>
              </div>
          </div>
        }
      </div>

    );
  };
  
  export default TrainingModulesPage;