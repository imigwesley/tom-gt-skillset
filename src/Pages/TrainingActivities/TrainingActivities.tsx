import { Alert, Backdrop, Breadcrumbs, Button, CircularProgress, Divider, IconButton, Link, Menu, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TrainingActivities.scss';
import '../../Components/ReviewProgress/ReviewProgress.scss';
import SubsectionLink from '../../Components/SubsectionLink/SubsectionLink';
import { ActivityProgress, MemberInformation, ActivityInformation, SubsectionInformation, ResponseInfo, SubmissionInformation } from '../../Types/types';
import { getAllUsersData, getSingleUserData, updateSingleUserData } from '../../utils/userApi';
import { PageProps } from '../../Types/props';
import { NavigateNext, List, West, MoreHoriz } from '@mui/icons-material';
import { getAllActivities } from '../../utils/activityApi';
import { getAllSubsections } from '../../utils/subsectionsApi';
import SubmissionUpload from '../../Components/SubmissionUpload/SubmissionUpload';
import { motion } from 'framer-motion';
import { deleteSubmission, getAllSubmissions, getSubmission } from '../../utils/submissionApi';
import { deleteFile, downloadFile } from '../../utils/imagesApi';


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
  const [allUsers, setAllUsers] = useState<MemberInformation[]>([]);
  const [startedSubmission, setStartedSubmission] = useState(false);
  const [allSubsections, setAllSubsections] = useState<SubsectionInformation[]>([]);
  const [currSubsection, setCurrSubsection] = useState<SubsectionInformation>();
  const [currUser, setCurrUser] = useState<MemberInformation>();
  const [menuOpen, setMenuOpen] = useState(true);
  const [submissions, setSubmissions] = useState<SubmissionInformation[]>([]);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: string]: HTMLElement | null }>({});
  const [submissionMenuOpenMap, setSubmissionMenuOpenMap] = useState<{ [key: string]: boolean }>({});
  const [localSubsectionApproval, setLocalSubsectionApproval] = useState<{[key: string]: (boolean | undefined)}>({})

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
      setCurrUser(tempCurrUser);

      // get all users
      const allUsersResponse = await getAllUsersData();
      setAllUsers(allUsersResponse);

      // get submissions info
      await fetchLocalSubmissions();

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

  useEffect(() => {  
    fetchLocalSubmissions();
  }, [currActivity]);

  const fetchLocalSubmissions = async () => {  
    // get all submission IDs from all subsections within the current activity
    const subsectionProgress = currUser?.progress.find(
      (act) => act.activityName === currActivity.activityName
    )?.subsectionProgress ?? [];
    const ids = subsectionProgress.flatMap((subsection) => subsection.submissionIds ?? []);
  
    if (ids.length === 0) {
      setSubmissions([]);
      setLocalSubsectionApproval((prev) => {
        const resetProgress = subsectionProgress.reduce((acc, subsection) => {
          acc[subsection.subsection] = undefined;
          return acc;
        }, {} as { [key: string]: boolean | undefined });
        return { ...prev, ...resetProgress };
      });
      return;
    }
  
    try {
      const responses = await Promise.all(
        ids.map(async (id) => {
          const response = await getSubmission(id);
          return response[0];
        })
      );
    
      // filter submissions belonging to the current user and sort them by timeSubmitted (most recent first)
      const tempSubmissions = responses
        .filter((resp) => resp?.submittedBy === currUser?.userId)
        .sort((a, b) => Number(b.timeSubmitted) - Number(a.timeSubmitted));
  
      setSubmissions(tempSubmissions);
      combineProgress(tempSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const combineProgress = (tempSubmissions: any[]) => {
    // submission records (those with deliverables)
    const tempSubsectionApproval: { [key: string]: boolean | undefined } = { ...localSubsectionApproval };
    tempSubmissions.forEach((submission) => {
      const { subsectionName, timeSubmitted, isApproved } = submission;
      if (
        !tempSubsectionApproval[subsectionName] ||
        Number(timeSubmitted) > Number(tempSubsectionApproval[subsectionName?.timeSubmitted] ?? 0)
      ) {
        tempSubsectionApproval[subsectionName] = isApproved ?? undefined;
      }
    });

    // user progress (no deliverables)
    currUser?.progress.find((act)=> act.activityName === currActivity.activityName)?.subsectionProgress?.map((sub) => {
      tempSubsectionApproval[sub.subsection] = true;
    })

    setLocalSubsectionApproval(tempSubsectionApproval);
  }

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
    setStartedSubmission(false);
    localStorage.setItem('subsection', passedSubsection);
  };

  const handleResponseProgress = async (resp: ResponseInfo) => {
    setResponseInfo(resp);
    // reload page if successfully submitted/deleted
    if (!resp.waiting && resp.response.isSuccess !== false) {
      window.location.reload();
    }
  }

  const deleteSubmissionRecord = async (submission: SubmissionInformation) => {
    try {
      // delete submission file(s) in s3
      submission.submissionFiles.map(async (file) => {
        await deleteFile(file, false);
      });

      // remove submission id from user's progress
      const userWhoSubmitted = allUsers?.find((user) => user.userId === submission.submittedBy);
      console.log('user who submitted initial', userWhoSubmitted);
      let currActivity;
      if (userWhoSubmitted) {
        userWhoSubmitted.progress.forEach((activity) => {
          activity.subsectionProgress = activity.subsectionProgress
            .map((subsection) => {
              const index = subsection.submissionIds.indexOf(submission.submissionId);
              if (index !== -1) {
                currActivity = activity.activityName
                console.log('removing from users progress');
                subsection.submissionIds.splice(index, 1);
              }
              return subsection;
            })
            .filter((subsection) => subsection.submissionIds.length > 0); // Remove subsection if empty
        });
        userWhoSubmitted.progress = userWhoSubmitted.progress.filter((activity) => activity.subsectionProgress.length > 0);
        console.log('now is', userWhoSubmitted)
        await updateSingleUserData(userWhoSubmitted);
      } else {
        console.log('no user found');
      }

      // remove submission record from submissions table
      await deleteSubmission(submission.submissionId);

      // update table on page
      await fetchLocalSubmissions();

      handleResponseProgress({waiting: false, response: {isSuccess: true, message: 'Successfully deleted submission'}});
    } catch (e) {
      handleResponseProgress({waiting: false, response: {isSuccess: false, message: 'Error deleting submission'}});
    }
    setTimeout(() => {
      handleResponseProgress({waiting: false, response: {isSuccess: null, message: ''}});
    }, 2000);
  }

  const downloadSubmission = (submission: SubmissionInformation) => {
    console.log('downloading')
    submission.submissionFiles.map((file) => {
      downloadFile(file, file.split('/').pop() || 'submission')
    })
  }

  const handleSubmissionMenuClick = (op: string, type: string, submission: SubmissionInformation) => {
    console.log('performing operation to ', op);
    switch (op) {
      case 'delete':
        deleteSubmissionRecord(submission);
        break;
      case 'download':
        downloadSubmission(submission);
        break;    
    }
    handleSubmissionMenuClose(submission.submissionId);
  };

  const handleOpenSubmissionMenu = (event: React.MouseEvent, submissionId: string) => {
    setAnchorElMap((prev) => ({ ...prev, [submissionId]: event.currentTarget as HTMLElement }));
    setSubmissionMenuOpenMap((prev) => ({ ...prev, [submissionId]: true }));
  };
  
  const handleSubmissionMenuClose = (submissionId: string) => {
    setAnchorElMap((prev) => ({ ...prev, [submissionId]: null }));
    setSubmissionMenuOpenMap((prev) => ({ ...prev, [submissionId]: false }));
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
            <div className={`sidebar-container ${menuOpen ? 'open' : 'collapsed'}`}>
                <motion.div className="toggle-button">
                    <IconButton disableTouchRipple onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <West /> : <List />}
                    </IconButton>
                </motion.div>
                <motion.div className={`motion-container ${menuOpen ? 'open' : ''}`}>
                    <div className={`background-card ${menuOpen ? 'visible' : ''}`}>
                        <Typography variant="h5">{currActivity.activityName}</Typography>
                        <Divider />
                        <div className="links-container">
                            {currActivity.subsectionNames.map((subsection, index) => (
                                <div key={index} onClick={() => handleSubsectionClick(subsection)}>
                                    <SubsectionLink
                                        index={index}
                                        isCurrent={currSubsection?.subsectionName === subsection}
                                        isApproved={localSubsectionApproval[subsection]}
                                        hasDeliverable={allSubsections.find((sub)=> sub.subsectionName === subsection)?.hasDeliverable}
                                        name={subsection}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
            <motion.div className="content-section" transition={{duration: 0.3, ease: 'easeInOut'}} >
              <div className="activity-container background-card visible" >
                <Typography variant="h4">{currSubsection?.subsectionName || ""}</Typography>
                <Divider variant="middle" />
                <div className="quill">
                  <div className="ql-snow">
                    <div className="ql-editor" dangerouslySetInnerHTML={{ __html: currSubsection?.subsectionHtml || "" }} />
                  </div>
                </div>
                {currSubsection?.hasDeliverable &&
                  <>
                    <Button className='sub-start' variant="contained" disableRipple onClick={() => setStartedSubmission(!startedSubmission)}>
                      {startedSubmission ? 'Cancel' : ((currUser?.progress?.find((activity) => activity.activityName === currActivity?.activityName)
                      ?.subsectionProgress.find((sub) => sub.subsection === currSubsection.subsectionName)
                      ?.submissionIds.length ?? 0) > 0 ?
                      'New Attempt' : 'Start Submission')}
                    </Button>
                    {startedSubmission && (
                      <div className='submission-container'>
                        <div className="upload-component">
                          <SubmissionUpload
                            loggedInUser={loggedInUser}
                            subsection={currSubsection?.subsectionName}
                            currActivity={activityName}
                            passResponseProgress={handleResponseProgress}
                          />
                        </div>
                        {submissions.filter((sub) => sub.subsectionName === currSubsection.subsectionName).length > 0 && 
                          <>
                            <Typography variant='h5' className='table-title'>
                              Submission History:
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Submission Time</TableCell>
                                  <TableCell>Status</TableCell>
                                  <TableCell>Files</TableCell>
                                  <TableCell />
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {submissions.filter((sub) => sub.subsectionName === currSubsection.subsectionName)
                                .map((submission) => {
                                  return (
                                    <TableRow key={submission.submissionId}>
                                      <TableCell>
                                        {new Date(Number(submission.timeSubmitted)).toLocaleString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </TableCell>
                                      <TableCell>
                                        <div className={`status ${submission.isApproved === null ? "pending" : submission.isApproved ? "approved" : "rejected"}`}>
                                          {submission.isApproved === null ? "Pending approval" : submission.isApproved ? "Approved" : "Submission rejected"}
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {submission.submissionFiles.length > 0
                                          ? submission.submissionFiles.map((file) => file?.split('/').pop()).join(", ")
                                          : "No Files"}
                                      </TableCell>
                                      <TableCell>
                                        <IconButton
                                          disableRipple
                                          onClick={(event) => handleOpenSubmissionMenu(event, submission.submissionId)}
                                        >
                                          <MoreHoriz />
                                        </IconButton> 
                                        <Menu
                                          elevation={1}
                                          anchorEl={anchorElMap[submission.submissionId] || null}
                                          open={submissionMenuOpenMap[submission.submissionId] || false}
                                          onClose={() => handleSubmissionMenuClose(submission.submissionId)}
                                        >
                                          <MenuItem disableRipple onClick={() => handleSubmissionMenuClick('delete', 'personal', submission)}>
                                            Delete Submission
                                          </MenuItem>
                                          <MenuItem disableRipple onClick={() => handleSubmissionMenuClick('download', 'personal', submission)}>
                                            Download Files
                                          </MenuItem>
                                        </Menu>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </>
                        }
                      </div>
                    )}
                  </>
                }
              </div>
            </motion.div>
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