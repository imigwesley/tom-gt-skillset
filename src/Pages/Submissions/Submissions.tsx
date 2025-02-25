import { Accordion, AccordionDetails, AccordionSummary, IconButton, Menu, MenuItem, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { PageProps } from "../../Types/props";
import { KeyboardArrowDown, KeyboardArrowUp, MoreHoriz, RowingSharp } from "@mui/icons-material";
// import SubmissionsTableRow from "../../Components/SubmissionsTableRow/SubmissionsTableRow";
import { useState, useEffect } from "react";
import { ActivityInformation, ActivitySubmissions, MemberInformation, SubmissionInformation, SubsectionSubmissions } from "../../Types/types";
import { getAllActivities } from "../../utils/activityApi";
import subsSample from "../../SampleData/SubmissionsSample";
import { getSingleUserData } from "../../utils/userApi";
import './Submissions.scss';


const SubmissionsPage = ({loggedInUser}: PageProps) => {

  const [currentTab, setCurrentTab] = useState(0);
  const [currUser, setCurrUser] = useState<MemberInformation>()
  const [personalActivitySubmissions, setPersonalActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [assignedActivitySubmissions, setAssignedActivitySubmissions] = useState<ActivitySubmissions[]>([]);
  const [submissionMenuOpen, setSubmissionMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      setCurrUser(tempCurrUser);

      const submissionsResponse = subsSample // await getAllSubmissions();
      const activityResponse = await getAllActivities();

      const personalActivitySubs = formatPersonalSubmissions(submissionsResponse, activityResponse, tempCurrUser);
      const assignedActivitySubs = formatAssignedSubmissions(submissionsResponse, activityResponse);

      setPersonalActivitySubmissions(personalActivitySubs);
      setAssignedActivitySubmissions(assignedActivitySubs);

      // setIsLoading(false)
      console.log('personalActivitySubs is', personalActivitySubs)
    }
    fetchData();
  }, []);

  const formatPersonalSubmissions = (
    submissionsResponse: SubmissionInformation[],
    activityResponse: ActivityInformation[],
    tempCurrUser: MemberInformation
  ): ActivitySubmissions[] => {
    const activitySubmissionsMap: Record<string, ActivitySubmissions> = {};
  
    activityResponse.forEach((activity) => {
      const subsectionSubmissionsMap: Record<string, SubsectionSubmissions> = {};
  
      activity.subsectionNames.forEach((subsectionName) => {
        const matchingSubmissions = submissionsResponse.filter(
          (submission) => submission.submittedBy && subsectionName === submission.subsectionName // make this check logged in user
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

  const handleSubmissionMenuClick = (curr: string) => {
    console.log('performing operation to ', curr);
    // make api calls here
    setAnchorEl(null);
    setSubmissionMenuOpen(false);
  };

  const handleSubmissionMenuClose = () => {
    setAnchorEl(null);
    setSubmissionMenuOpen(false);
  }

  const handleOpenSubmissionMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setSubmissionMenuOpen(true);
  }

  return (
    <div className="page-container">
      <div className="header">
        <div className="tabs-container">
          <Tabs value={currentTab} onChange={handleChangeTab}>
            <Tab disableRipple label='Your Submissions' />
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
        {currentTab === 0 ?
          <div>
          {personalActivitySubmissions.map((activity) => (
            <div  className="activity-page-section" key={activity.activityName}>
              <Typography variant="h5">{activity.activityName}</Typography>
              {activity.subsectionSubmissions.reduce((acc, subsection) => acc + subsection.submissions.length, 0) > 0 ? (
                <div>
                  {activity.subsectionSubmissions.map((subsection) => ( 
                    <Accordion key={subsection.subsectionName} disableGutters>
                      <AccordionSummary
                        expandIcon={<KeyboardArrowDown />}
                        disabled={subsection.submissions.length === 0}
                      >
                        <Typography variant="subtitle1">{subsection.subsectionName}</Typography>
                        <Typography sx={{ marginLeft: "auto", fontStyle: "italic" }}>
                          {`${subsection.submissions.length} submission${subsection.submissions.length !== 1 ? 's' : ''}`}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {subsection.submissions.length > 0 ? (
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
                              {subsection.submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                  <TableCell>{new Date(submission.timeSubmitted).toLocaleString()}</TableCell>
                                  <TableCell>{submission.isApproved ? "Approved" : "Pending approval"}</TableCell>
                                  <TableCell>{submission.submissionFiles.join(", ") || "No Files"}</TableCell>
                                  <TableCell>
                                <IconButton disableRipple onClick={handleOpenSubmissionMenu}>
                                  <MoreHoriz />
                                </IconButton> 
                                <Menu anchorEl={anchorEl} open={submissionMenuOpen} onClose={handleSubmissionMenuClose}>
                                  <MenuItem onClick={() => handleSubmissionMenuClick('download') }>Download Files</MenuItem>
                                </Menu>
                              </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography>No submissions yet.</Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              ) : (
                <div>
                  <Typography>You have not submitted anything for this activity.</Typography>
                </div>
              )}
            </div>
          ))}
        </div>
        
        : 
        <div>
        {assignedActivitySubmissions.map((activity) => (
          <div  className="activity-page-section" key={activity.activityName}>
            <Typography variant="h5">{activity.activityName}</Typography>
            <div>
              {activity.subsectionSubmissions.map((subsection) => ( 
                <Accordion key={subsection.subsectionName} disableGutters>
                  <AccordionSummary
                    expandIcon={<KeyboardArrowDown />}
                    disabled={subsection.submissions.length === 0}
                  >
                    <Typography variant="subtitle1">{subsection.subsectionName}</Typography>
                    <Typography sx={{ marginLeft: "auto", fontStyle: "italic" }}>
                      {`${subsection.submissions.length} submission${subsection.submissions.length !== 1 ? 's' : ''}`}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {subsection.submissions.length > 0 ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Submission Time</TableCell>
                            <TableCell>Submitted By</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Files</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subsection.submissions.map((submission) => (
                            <TableRow key={submission.id}>
                              <TableCell>{new Date(submission.timeSubmitted).toLocaleString()}</TableCell>
                              <TableCell>{submission.submittedBy}</TableCell>
                              <TableCell>{submission.isApproved ? "Approved" : "Pending approval"}</TableCell>
                              <TableCell>{submission.submissionFiles.join(", ") || "No Files"}</TableCell>
                              <TableCell>
                                <IconButton disableRipple onClick={handleOpenSubmissionMenu}>
                                  <MoreHoriz />
                                </IconButton> 
                                <Menu anchorEl={anchorEl} open={submissionMenuOpen} onClose={handleSubmissionMenuClose}>
                                  <MenuItem onClick={() => handleSubmissionMenuClick('download') }>Download Files</MenuItem>
                                  <MenuItem onClick={() => handleSubmissionMenuClick('approve') }>Approve Submission</MenuItem>
                                  {/* <MenuItem onClick={() => { handleClose(); }}>Reject Submission</MenuItem> */}
                                </Menu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography>No submissions yet.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        ))}
      </div>
        }
      </div>
    </div>
  )
}

export default SubmissionsPage;