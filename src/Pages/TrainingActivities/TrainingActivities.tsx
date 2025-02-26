import { Breadcrumbs, CircularProgress, Divider, LinearProgress, Link, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './TrainingActivities.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
// import subSectionsSample from '../../SampleData/SubsectionsSample';
import { ActivityProgress, MemberInformation, ActivityInformation, SubsectionInformation } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
// import activitiesSample from '../../SampleData/ActivitiesSample';
import { PageProps } from '../../Types/props';
import { NavigateNext } from '@mui/icons-material';
import { getAllActivities } from '../../utils/activityApi';
import { getAllSubsections } from '../../utils/subsectionsApi';
import SubmissionUpload from '../../Components/SubmissionUpload/SubmissionUpload';



const TrainingModulesPage = ({ loggedInUser }: PageProps) => {
  const { activityName } = useParams();
  const navigate = useNavigate();
  const [currActivity, setCurrActivity] = useState<ActivityInformation>({
    isTeam: false,
    isIndividual: false,
    activityName: activityName || '',
    subsectionNames: [],
    imagePath: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const [currSubsection, setCurrSubsection] = useState<SubsectionInformation>();
  const [memberProgress, setMemberProgress] = useState<ActivityProgress[]>([]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/')} className='breadcrumb-link' >
      Activities
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {currActivity.activityName + ' - ' + currSubsection?.subsectionName}
    </Typography>,
  ]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Get member info
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setMemberProgress(tempCurrUser.progress);

      // Get activity info
      const allActivities = await getAllActivities();
      const tempCurrActivity = allActivities.find((act) => act.activityName === currActivity.activityName) || {
        isTeam: false,
        isIndividual: false,
        activityName: '',
        subsectionNames: [],
        imagePath: '',
      };
      setCurrActivity(tempCurrActivity);

      // Get subsection info
      const subsectionsResponse = await getAllSubsections();
      setAllSubsections(subsectionsResponse);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allSubsections.length > 0) {
      const todoSubsectionName = findNextSubsectionToComplete(
        memberProgress.find((prog) => prog.activityName === currActivity.activityName),
        currActivity.subsectionNames
      );
      setCurrSubsection(allSubsections.find((sub) => sub.subsectionName === todoSubsectionName));
      setIsLoading(false);
    }
  }, [allSubsections, memberProgress, currActivity]);

  const findNextSubsectionToComplete = (progress: ActivityProgress | undefined, names: string[]): string => {
    if (!progress) return names[0];
    for (const name of names) {
      if (!progress.subsectionsComplete.includes(name)) {
        return name;
      }
    }
    return names[0];
  };

  const handleSubsectionClick = (passedSubsection: string) => {
    setCurrSubsection(allSubsections.find((subsection) => subsection.subsectionName === passedSubsection));
  };

  return (
    <div>      
      {isLoading ?
        <div className='selector-centering'>
          <div style={{padding:'200px', width:'300px'}}>
            <CircularProgress />
          </div>
        </div>
      :
        <>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          {breadcrumbs}
        </Breadcrumbs>
        <div className='activity-page-container'>
            <div className='background-card'>
              <Typography variant='h5'>{currActivity.activityName}</Typography>
              <Divider variant='middle' />
              <div className='links-container'>
                {currActivity.subsectionNames.map((subsection, index) => {
                  return (
                    <div key={index} onClick={() => handleSubsectionClick(subsection)}>
                      <SubsectionLink 
                        isCurrent={currSubsection?.subsectionName === subsection} 
                        isCompleted={memberProgress?.find((curr) => curr.activityName === currActivity.activityName)?.subsectionsComplete.includes(subsection) ? true : false} 
                        name={subsection} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className='activity-container background-card'>
              <Typography variant='h4'>{currSubsection?.subsectionName || ''}</Typography>
              <Divider variant='middle' />
              <div className='quill'>
                <div className='ql-snow'>
                  <div className='ql-editor' dangerouslySetInnerHTML={{__html: currSubsection?.subsectionHtml || ''}}/>
                </div>
              </div>
              {currSubsection?.hasDeliverable &&
                <div>
                  {/*<SubmissionUpload />*/}
                </div>
              }
            </div>
        </div>
        </>
      }
    </div>
  );
};

export default TrainingModulesPage;