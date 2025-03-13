import { Alert, Backdrop, CircularProgress, Tab, Tabs } from "@mui/material";
import { PageProps } from "../../Types/props";
import { useState, useEffect } from "react";
import { ActivityInformation, ActivitySubmissions, MemberInformation, ResponseInfo, SubmissionInformation, SubsectionSubmissions } from "../../Types/types";
import { getAllActivities } from "../../utils/activityApi";
import { getAllUsersData } from "../../utils/userApi";
import './Submissions.scss';
import { getAllSubmissions } from "../../utils/submissionApi";
import ReviewProgress from "../../Components/ReviewProgress/ReviewProgress";


const SubmissionsPage = ({loggedInUser}: PageProps) => {

  const [currentTab, setCurrentTab] = useState(0);
  const [currUser, setCurrUser] = useState<MemberInformation>();
  const [allUsers, setAllUsers] = useState<MemberInformation[]>();
  const [personalActivitySubmissions, setPersonalActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [assignedActivitySubmissions, setAssignedActivitySubmissions] = useState<ActivitySubmissions[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const allUsersResponse = await getAllUsersData();
      setAllUsers(allUsersResponse);
      const tempCurrUser = allUsersResponse.find((user)=> user.userId === loggedInUser?.username);
      setCurrUser(tempCurrUser);

      const submissionsResponse = await getAllSubmissions();
      const activityResponse = await getAllActivities();

      const personalActivitySubs = formatPersonalSubmissions(submissionsResponse, activityResponse, loggedInUser?.username || '');
      const assignedActivitySubs = formatAssignedSubmissions(submissionsResponse, activityResponse);

      setPersonalActivitySubmissions(personalActivitySubs);
      setAssignedActivitySubmissions(assignedActivitySubs);

      setIsLoading(false)
    }
    fetchData();
  }, []);

  const formatPersonalSubmissions = (
    submissionsResponse: SubmissionInformation[],
    activityResponse: ActivityInformation[],
    currUserId: string
  ): ActivitySubmissions[] => {
    const activitySubmissionsMap: Record<string, ActivitySubmissions> = {};
  
    activityResponse.forEach((activity) => {
      const subsectionSubmissionsMap: Record<string, SubsectionSubmissions> = {};
  
      activity.subsectionNames.forEach((subsectionName) => {
        const matchingSubmissions = submissionsResponse.filter(
          (submission) => submission.submittedBy === currUserId && subsectionName === submission.subsectionName
        );
  
        subsectionSubmissionsMap[subsectionName] = {
          subsectionName,
          submissions: matchingSubmissions || [],
        };
      });
  
      if (Object.keys(subsectionSubmissionsMap).length > 0) {
        activitySubmissionsMap[activity.activityName] = {
          activityName: activity.activityName,
          subsectionSubmissions: Object.values(subsectionSubmissionsMap),
        };
      } else {
        // activities without submissions are included
        activitySubmissionsMap[activity.activityName] = {
          activityName: activity.activityName,
          subsectionSubmissions: [],
        };
      }
    });
  
    // make map into array, sort based on relevancy
    return Object.values(activitySubmissionsMap).sort(
      (a, b) => b.subsectionSubmissions.length - a.subsectionSubmissions.length
    );
  };

  const formatAssignedSubmissions = (
    submissionsResponse: SubmissionInformation[],
    activityResponse: ActivityInformation[]
  ): ActivitySubmissions[] => {
    const activitySubmissionsMap: Record<string, ActivitySubmissions> = {};
  
    activityResponse.forEach((activity) => {
      const subsectionSubmissionsMap: Record<string, SubsectionSubmissions> = {};
  
      activity.subsectionNames.forEach((subsectionName) => {
        const matchingSubmissions = submissionsResponse.filter(
          (submission) => submission.submittedBy && subsectionName === submission.subsectionName
        );
  
        subsectionSubmissionsMap[subsectionName] = {
          subsectionName,
          submissions: matchingSubmissions || [],
        };
      });
  
      if (Object.keys(subsectionSubmissionsMap).length > 0) {
        activitySubmissionsMap[activity.activityName] = {
          activityName: activity.activityName,
          subsectionSubmissions: Object.values(subsectionSubmissionsMap),
        };
      } else {
        // activities without submissions are included
        activitySubmissionsMap[activity.activityName] = {
          activityName: activity.activityName,
          subsectionSubmissions: [],
        };
      }
    });

    // make map into array, sort based on relevancy
    return Object.values(activitySubmissionsMap).sort(
      (a, b) => b.subsectionSubmissions.length - a.subsectionSubmissions.length
    );
  }
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    console.log('new Value is', newValue)
    setCurrentTab(newValue);
  };

  const handleResponseProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
  }

  const handleReload = async () => {
    const submissionsResponse = await getAllSubmissions();
    const activityResponse = await getAllActivities();

    const personalActivitySubs = formatPersonalSubmissions(submissionsResponse, activityResponse, loggedInUser?.username || '');
    const assignedActivitySubs = formatAssignedSubmissions(submissionsResponse, activityResponse);

    setPersonalActivitySubmissions(personalActivitySubs);
    setAssignedActivitySubmissions(assignedActivitySubs);
  }


  return (
    <div className="page-container">
      {isLoading ?
        <div style={{alignSelf: 'anchor-center', paddingTop: '25%'}}>
          <CircularProgress />
        </div>
      : 
      <>
        <div className="header">
          <div className="tabs-container">
            <Tabs value={currentTab} onChange={handleChangeTab} >
              <Tab disableRipple label='Your Submissions' className={!currUser?.roles.isAdmin ? 'non-clickable' : ''}/>
              {currUser?.roles.isAdmin && <Tab disableRipple label='Review Submissions' />}
            </Tabs>
          </div>
        </div>
        <div className="filter-bar">
          <div style={{flexGrow: 1}} />
          <div className="searchbar">

          </div>
        </div>
        <div className="submissions-table">
          <ReviewProgress 
            isPersonal={currentTab === 0} 
            activitySubmissions={currentTab === 0 ? personalActivitySubmissions : assignedActivitySubmissions} 
            passResponseProgress={handleResponseProgress}
            allUsers={allUsers || []}
            onUpdateSubmission={handleReload}
          />
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
  )
}

export default SubmissionsPage;