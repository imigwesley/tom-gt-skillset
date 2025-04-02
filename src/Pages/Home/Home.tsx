import { useNavigate } from 'react-router-dom';
import './Home.scss';
import '../../Feedback.scss';
import { Alert, Card, CardContent, CardMedia, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import { MemberInformation, ApiSendInformation, ActivityInformation, ResponseInfo, SubsectionInformation } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
import { Operations } from '../../Types/enums';
import { PageProps } from '../../Types/props';
import { getAllActivities } from '../../utils/activityApi';
import { useImageCache } from '../../ImageCacheContext';
import AdminModal from '../../Components/AdminModal/AdminModal';
import { getAllSubsections } from '../../utils/subsectionsApi';
import { getSubmission } from '../../utils/submissionApi';



const HomePage = ({loggedInUser, onUserCreation}: PageProps) => {

  const navigate = useNavigate();
  // user creation modal
  const [promptForUserRecordCreation, setPromptForUserRecordCreation] = useState(false);
  const [percentCompletion, setPercentCompletion] = useState<{activityName: string, percentComplete: number}[]>([]);
  const [responseInfo, setResponseInfo] = useState<ResponseInfo>(
    {
      waiting: false, 
      response: {
        isSuccess: null, 
        message: ''
      }
    }
  );
  
  // home page
  const [currUser, setCurrUser] = useState<MemberInformation | null>(null);
  const [apiDataToSend, setApiDataToSend] = useState<ApiSendInformation>({
    user: undefined,
    activity: undefined,
    subsection: undefined,
    team: undefined
  });
  const [activities, setActivities] = useState<ActivityInformation[] | null>(null);
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[] | null>(null);
  const { getImage } = useImageCache();

  useEffect(() => {
    const fetchData = async () => {
      setResponseInfo({waiting: true, response: {isSuccess: null, message: ''}});

      const tempCurrUser = await checkForUserAcct();
      let tempAllActivities = await getAllActivities();
      let tempAllSubsections = await getAllSubsections();

      // load images
      tempAllActivities = await Promise.all(
        tempAllActivities.map(async (activity) => {
          if (!activity.imagePath) return { ...activity, imagePath: "" };
          const imageUrl = await getImage(activity.imagePath);
          return { ...activity, imagePath: imageUrl };
        })
      );

      const updatedProgress = await Promise.all(
        tempCurrUser.progress.map(async (activity) => {
          const relevantSubsections =
            tempAllActivities.find((act) => act.activityName === activity.activityName)?.subsectionNames || [];
          const numWithDeliverable = tempAllSubsections
          ?.filter((sub) => sub.hasDeliverable && relevantSubsections.includes(sub.subsectionName))
          .length || 0;
      
          const completedSubs = activity.subsectionProgress;
      
          // find number of most recent submissions that have been approved
          const numCompleted = (
            await Promise.all(
              completedSubs.map(async (subRecord) => {
                const latestSubmissionId = subRecord.submissionIds[subRecord.submissionIds.length - 1];
                const latestSubmissionInfo = await getSubmission(latestSubmissionId);
                return latestSubmissionInfo?.[0]?.isApproved ? 1 : 0;
              })
            )
          ).reduce<number>((sum, approved) => sum + approved, 0);
          const percentComplete = numWithDeliverable ? Math.round((numCompleted / numWithDeliverable) * 100) : 0;
      
          return {
            activityName: activity.activityName,
            percentComplete,
          };
        })
      );
      
      setPercentCompletion(updatedProgress);
      

      setCurrUser(tempCurrUser);
      setActivities(tempAllActivities);
      setAllSubsections(tempAllSubsections);
      setResponseInfo({waiting: false, response: {isSuccess: null, message: ''}});
    };

    fetchData();
  }, []);
  
  

  /****************************** Helper functions ***********************************/
  const checkForUserAcct = async () => {
    let tempCurrUser: MemberInformation;
    try {
      // user record found
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      tempCurrUser = singleUserResponse[0];
      setPromptForUserRecordCreation(!tempCurrUser);
    } catch (e) {
      // no user record found. Create new user record in DB
      tempCurrUser = {
        userId: '',
        identifiers: {
          accountEmail: '',
          name: '',
          gtID: '',
          otherEmails: []
        },
        roles: {
            role: '',
            isAdmin: false
        },
        teams: {
            teamMembership: [],
            teamsAdvising: []
        },
        progress: []
      }
    }
    return tempCurrUser;
  };

  /*********************************** Event handlers *************************************/
  const handleCardClick = (activityName: string) => {
    console.log(activityName);
    navigate(`/activities/${activityName}`);
  }

  const handleRefreshPage = () => {
    onUserCreation?.();
  }

  const handleApiProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
  }

  return (
    <div className='home-page-container'>
      {responseInfo.waiting ? 
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <CircularProgress />
        </div>
      :
        <div>
          { promptForUserRecordCreation && <AdminModal currentOperation={Operations.ADD_USER} closeModal={handleRefreshPage} passResponseProgress={handleApiProgress} />}
          <div className='header'>
            <Typography variant='h4' align='center'>
              Hello, {currUser?.identifiers?.name}! What would you like to learn today?
            </Typography>
          </div>
          <div className='activity-card-container'>
            {activities?.map((activity, index) => {
              const localPctComplete = percentCompletion.find((obj)=> obj.activityName === activity.activityName)?.percentComplete || 0.0;
              
              return (
                <Card className={'activity-card'} onClick={() => handleCardClick(activity.activityName)} key={index}>
                  <CardMedia
                    className="activity-image"
                    component="img" 
                    src={activity.imagePath}
                  />
                  <CardContent className='activity-card-content'>
                    <Typography>
                      {activity.activityName}
                    </Typography>
                    <div className='progress-container'>
                      <LinearProgress variant='determinate' value={localPctComplete} className='progress-bar'/>
                      <Typography>
                        {localPctComplete}% complete
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

        </div>
      }

      {responseInfo.response.isSuccess !== null &&
        <div className='feedback-container'>
          <Alert className='feedback' severity={responseInfo.response.isSuccess ? 'success' : 'error'}>{responseInfo.response.message}</Alert>
        </div>
      }
    </div>
  );
};

export default HomePage;