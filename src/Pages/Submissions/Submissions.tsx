import { Alert, Backdrop, CircularProgress, IconButton, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import { PageProps } from "../../Types/props";
import { useState, useEffect, useRef } from "react";
import { ActivityInformation, ActivitySubmissions, MemberInformation, ResponseInfo, SubmissionInformation, SubsectionSubmissions } from "../../Types/types";
import { getAllActivities } from "../../utils/activityApi";
import { getAllUsersData } from "../../utils/userApi";
import './Submissions.scss';
import { getAllSubmissions } from "../../utils/submissionApi";
import ReviewProgress from "../../Components/ReviewProgress/ReviewProgress";
import { Search } from "@mui/icons-material";


const SubmissionsPage = ({loggedInUser}: PageProps) => {

  const [currentTab, setCurrentTab] = useState(0);
  const [currUser, setCurrUser] = useState<MemberInformation>();
  const [allUsers, setAllUsers] = useState<MemberInformation[]>();
  const [allPersonalActivitySubmissions, setAllPersonalActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [allReviewActivitySubmissions, setAllReviewActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [searchedPersonalActivitySubmissions, setSearchedPersonalActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [searchedReviewActivitySubmissions, setSearchedReviewActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
      const reviewActivitySubs = formatReviewSubmissions(submissionsResponse, activityResponse);

      setAllPersonalActivitySubmissions(personalActivitySubs);
      setAllReviewActivitySubmissions(reviewActivitySubs);
      setSearchedPersonalActivitySubmissions(personalActivitySubs);
      setSearchedReviewActivitySubmissions(reviewActivitySubs);

      setIsLoading(false)
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      // reset
      setSearchedPersonalActivitySubmissions(allPersonalActivitySubmissions);
      setSearchedReviewActivitySubmissions(allReviewActivitySubmissions);
    } else {
      if (currentTab === 0) {
        // your submissions
        const filtered = filterByQuery(allPersonalActivitySubmissions);
        setSearchedPersonalActivitySubmissions(filtered);
      } else {
        // reviewing submissions
        const filtered = filterByQuery(allReviewActivitySubmissions);
        setSearchedReviewActivitySubmissions(filtered);
      }
    }
  }, [searchQuery]);

  const filterByQuery = (submissions: ActivitySubmissions[]) => {
    const lowerQuery = searchQuery.toLowerCase();
    const results = submissions.map(activity => {
      // Copy the activity object
      const filteredActivity = { ...activity };
      
      // Filter subsections
      filteredActivity.subsectionSubmissions = activity.subsectionSubmissions.map(subsection => {
        // Copy the subsection object
        const filteredSubsection = { ...subsection };
        
        // Filter submissions that contain the query in any of their values
        filteredSubsection.submissions = subsection.submissions.filter(submission => {
          // Format date for searching
          const formattedDate = new Date(Number(submission.timeSubmitted)).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).toLowerCase();
          
          // Get user's name
          const userName = allUsers?.find((user) => user.userId === submission.submittedBy)?.identifiers.name?.toLowerCase() || '';
          
          // Check if any of the submission's properties contain the search query
          return (
            submission.submissionId.toLowerCase().includes(lowerQuery) ||
            submission.subsectionName.toLowerCase().includes(lowerQuery) ||
            formattedDate.includes(lowerQuery) ||
            submission.status.toString().toLowerCase().includes(lowerQuery) ||
            userName.includes(lowerQuery) ||
            submission.submissionFiles.some(file => file.toLowerCase().includes(lowerQuery)) ||
            submission.submissionFeedback.toLowerCase().includes(lowerQuery)
          );
        });
        
        return filteredSubsection;
      });
      
      return filteredActivity;
    });
    
    return results;
  };

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

  const formatReviewSubmissions = (
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
    setCurrentTab(newValue);
    setSearchQuery('');
  };

  const handleResponseProgress = (resp: ResponseInfo) => {
    setResponseInfo(resp);
  }

  const handleReload = async () => {
    const submissionsResponse = await getAllSubmissions();
    const activityResponse = await getAllActivities();

    const personalActivitySubs = formatPersonalSubmissions(submissionsResponse, activityResponse, loggedInUser?.username || '');
    const reviewActivitySubs = formatReviewSubmissions(submissionsResponse, activityResponse);

    setAllPersonalActivitySubmissions(personalActivitySubs);
    setAllReviewActivitySubmissions(reviewActivitySubs);

    // filter and assign here, too
  }

  const handleIconClick = () => {
    setSearchFocused(true);
    inputRef.current?.focus();
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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
          <TextField
            variant="outlined"
            className="search-input"
            placeholder={!searchFocused ? 'search for a submission' : ''}
            inputRef={inputRef}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton className="search-icon" onClick={handleIconClick} disableRipple tabIndex={-1}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </div>
        <div className="submissions-table">
          <ReviewProgress 
            isPersonal={currentTab === 0} 
            activitySubmissions={currentTab === 0 ? searchedPersonalActivitySubmissions : searchedReviewActivitySubmissions} 
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