import { Alert, Backdrop, Breadcrumbs, Button, CircularProgress, Divider, Link, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TrainingActivities.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
import { ActivityProgress, MemberInformation, ActivityInformation, SubsectionInformation, ResponseInfo } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
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
  const [responseInfo, setResponseInfo] = useState<ResponseInfo>(
    {
      waiting: false, 
      response: {
        isSuccess: null, 
        message: ''
      }
    }
  );
  const [startedSubmission, setStartedSubmission] = useState(false);
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const [currSubsection, setCurrSubsection] = useState<SubsectionInformation>();
  const [memberProgress, setMemberProgress] = useState<ActivityProgress[]>([]);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" onClick={() => navigate('/')} className='breadcrumb-link' >
      Activities
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {currActivity.activityName}
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

      // direct to relevant subsection: last worked on if in same activity, or next one not yet finished if not same activity
      let todoSubsection: string;
      const storedSubsection = localStorage.getItem('subsection');
      if (storedSubsection && tempCurrActivity.subsectionNames.includes(storedSubsection)) {
        todoSubsection = storedSubsection;
      } else {
        localStorage.removeItem('subsection');
        todoSubsection = findNextSubsectionToComplete(
          tempCurrUser.progress.find((prog) => prog.activityName === currActivity.activityName),
          tempCurrActivity.subsectionNames
        );
      }
      setCurrSubsection(subsectionsResponse.find((sub) => sub.subsectionName === todoSubsection));

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const findNextSubsectionToComplete = (progress: ActivityProgress | undefined, names: string[]): string => {
    if (!progress) return names[0];
    for (const name of names) {
      if (!progress.subsectionProgress.find((sub) => sub.subsection === name)) {
        return name;
      }
    }
    return names[0];
  };

  const handleSubsectionClick = (passedSubsection: string) => {
    setCurrSubsection(allSubsections.find((subsection) => subsection.subsectionName === passedSubsection));
    localStorage.setItem('subsection', passedSubsection);
  };

  const handleResponseProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
    // hide submission component if successfully submitted
    if (!resp.waiting && resp.response.isSuccess !== false) setStartedSubmission(false);
  }

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
                        isCompleted={memberProgress?.find((curr) => curr.activityName === currActivity.activityName)?.subsectionProgress.find((sub) => sub.subsection === subsection) ? true : false} 
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
              {currSubsection?.hasDeliverable && (
                startedSubmission ?
                  <div className='submission-container'>
                    <SubmissionUpload loggedInUser={loggedInUser} subsection={currSubsection?.subsectionName} currActivity={activityName} passResponseProgress={handleResponseProgress}/>
                    <Button variant='contained' disableRipple onClick={() => setStartedSubmission(false)}>
                      Cancel
                    </Button>
                  </div>
                : 
                  <div>
                    <Button variant='contained' disableRipple onClick={() => setStartedSubmission(true)}>
                      Start submission
                    </Button>
                  </div>
              )}
            </div>
        </div>
        </>
      }
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={responseInfo.waiting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {responseInfo.response.isSuccess !== null &&
        <div className='feedback-container'>
          <Alert className='feedback' severity={responseInfo.response.isSuccess ? 'success' : 'error'}>{responseInfo.response.message}</Alert>
        </div>
      }
    </div>
  );
};

export default TrainingModulesPage;