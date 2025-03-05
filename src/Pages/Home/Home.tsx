import { useNavigate } from 'react-router-dom';
import './Home.scss';
import '../../Feedback.scss';
import { Alert, Card, CardContent, CardMedia, CircularProgress, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import LinearProgressWithLabel from '../../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import { MemberInformation, ApiSendInformation, ActivityInformation, ResponseInfo } from '../../Types/types';
import { getSingleUserData } from '../../utils/userApi';
import { Operations } from '../../Types/enums';
import { PageProps } from '../../Types/props';
import { getAllActivities } from '../../utils/activityApi';
import { getFile } from '../../utils/imagesApi';
import { useImageCache } from '../../ImageCacheContext';
import AdminModal from '../../Components/AdminModal/AdminModal';



const HomePage = ({loggedInUser, onUserCreation}: PageProps) => {

  const navigate = useNavigate();
  // user creation modal
  const [promptForUserRecordCreation, setPromptForUserRecordCreation] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [invalidapiDataToSend, setInvalidapiDataToSend] = useState(false);
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
  const { getImage } = useImageCache();
  

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


  useEffect(() => {
    const fetchData = async () => {
      setResponseInfo({waiting: true, response: {isSuccess: null, message: ''}});

      const tempCurrUser = await checkForUserAcct();
      let tempAllActivities = await getAllActivities();

      // load images
      tempAllActivities = await Promise.all(
        tempAllActivities.map(async (activity) => {
          if (!activity.imagePath) return { ...activity, imagePath: "" };
          const imageUrl = await getImage(activity.imagePath);
          return { ...activity, imagePath: imageUrl };
        })
      );

      setCurrUser(tempCurrUser);
      setActivities(tempAllActivities);
      setResponseInfo({waiting: false, response: {isSuccess: null, message: ''}});
    };

    fetchData();
  }, []);



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

  // const handleNext = async () => {
  //   if (activeStep === 1) {
  //     // submit button
  //     handleCloseModal();
  //     setIsLoading(true);
  //     console.log('data waiting for the api is: ', apiDataToSend)

  //     if (!apiDataToSend.user) throw new Error;
  //     console.log('right before creation it is:',apiDataToSend.user)
  //     const response = await createSingleUserData(apiDataToSend?.user);
  //     console.log('response is', response)
  //     setCurrUser(apiDataToSend?.user);
  //     handleApiResponse(response);
  //     setIsLoading(false);
  //   } else {
  //     // next button
  //     if (!isDataValid(apiDataToSend, undefined, activeStep)) {
  //       setInvalidapiDataToSend(true);
  //     } else {
  //       setInvalidapiDataToSend(false);
  //       setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //     }
  //   }
  // };
  
  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  //   setApiDataToSend({
  //     user: undefined,
  //     activity: undefined,
  //     subsection: undefined,
  //     team: undefined
  //   });
  // };

  // const handleApiInfoChange = (info: MemberInformation | ActivityInformation | SubsectionInformation | TeamInformation) => {
  //   console.log('changed inside home.tsx', info);
  //   if (isMemberInformation(info) && loggedInUser?.signInDetails?.loginId) {
  //     let temp = {...apiDataToSend};
  //     temp.user = info;
  //     temp.user.identifiers.accountEmail = loggedInUser?.signInDetails?.loginId;
  //     temp.user.userId = loggedInUser?.username;
  //     temp.user.roles = {
  //       isAdmin: false,
  //       role: 'Member'
  //     }
  //     setApiDataToSend(temp);
  //   } else {
  //     console.warn('invalid member information')
  //   }
  // }

  return (
    <div className='home-page-container'>
      {responseInfo.waiting ? 
        <div style={{padding:'200px', width:'300px'}}>
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
              const numSubsections = activity.subsectionNames.length;
              const numCompleted = currUser?.progress?.find((m) => m.activityName === activity.activityName)?.subsectionProgress.length;
              const percentComplete = numCompleted ? Math.round((numCompleted / numSubsections) * 100) : 0.0;
              
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
                      <LinearProgress variant='determinate' value={percentComplete} className='progress-bar'/>
                      <Typography>
                        {numCompleted}/{numSubsections} complete
                      </Typography>
                    </div>
                    {/* <LinearProgressWithLabel total={numSubsections} complete={numCompleted} /> */}
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