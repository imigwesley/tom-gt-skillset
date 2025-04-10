import { KeyboardArrowDown, MoreHoriz } from "@mui/icons-material";
import { Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Menu, MenuItem, Dialog, Button, TextField } from "@mui/material";
import { ReviewProgressProps } from "../../Types/props";
import { ActivitySubmissions, SubmissionInformation } from "../../Types/types";
import { deleteFile, downloadFile } from "../../utils/filesApi";
import { deleteSubmission, updateSubmission } from "../../utils/submissionApi";
import { updateSingleUserData } from "../../utils/userApi";
import { useEffect, useState } from "react";
import './ReviewProgress.scss';
import { SubmissionStatus } from "../../Types/enums";

const ReviewProgress = ({isPersonal, activitySubmissions, allUsers, passResponseProgress, onUpdateSubmission}: ReviewProgressProps) => {
  const [anchorElMap, setAnchorElMap] = useState<{ [key: string]: HTMLElement | null }>({});
  const [submissionMenuOpenMap, setSubmissionMenuOpenMap] = useState<{ [key: string]: boolean }>({});
  const [sortedSubmissions, setSortedSubmissions] = useState<ActivitySubmissions[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submissionReviewing, setSubmissionReviewing] = useState<SubmissionInformation | null>(null);
  const [submissionFeedback, setSubmissionFeedback] = useState<string>('');

  useEffect(() => {
    if (!activitySubmissions) return;

    const sorted = activitySubmissions.map(activity => ({
        ...activity,
        subsectionSubmissions: activity.subsectionSubmissions.map(subsection => ({
            ...subsection,
            submissions: [...subsection.submissions].sort(
                (a, b) => Number(b.timeSubmitted) - Number(a.timeSubmitted)
            )
        }))
    }));

    setSortedSubmissions(sorted);
}, [activitySubmissions]);

  const deleteSubmissionRecord = async (submission: SubmissionInformation) => {
    try {
      // delete submission file(s) in s3
      submission.submissionFiles.map(async (file) => {
        await deleteFile(file, false);
      });

      // remove submission id from user's progress
      const userWhoSubmitted = allUsers?.find((user) => user.userId === submission.submittedBy);
      let currActivity;
      if (userWhoSubmitted) {
        userWhoSubmitted.progress.forEach((activity) => {
          activity.subsectionProgress = activity.subsectionProgress
            .map((subsection) => {
              const index = subsection.submissionIds.indexOf(submission.submissionId);
              if (index !== -1) {
                currActivity = activity.activityName
                subsection.submissionIds.splice(index, 1);
              }
              return subsection;
            })
            .filter((subsection) => subsection.submissionIds.length > 0); // Remove subsection if empty
        });
        userWhoSubmitted.progress = userWhoSubmitted.progress.filter((activity) => activity.subsectionProgress.length > 0);
        await updateSingleUserData(userWhoSubmitted);
      }

      // remove submission record from submissions table
      await deleteSubmission(submission.submissionId);

      // update table on page
      onUpdateSubmission();

      passResponseProgress?.({waiting: false, response: {isSuccess: true, message: 'Successfully deleted submission'}});
    } catch (e) {
      passResponseProgress?.({waiting: false, response: {isSuccess: false, message: 'Error deleting submission'}});
    }
    setTimeout(() => {
      passResponseProgress?.({waiting: false, response: {isSuccess: null, message: ''}});
    }, 2000);
  }

  const downloadSubmission = (submission: SubmissionInformation) => {
    submission.submissionFiles.map((file) => {
      downloadFile(file, file.split('/').pop() || 'submission')
    })
  }

  const approveSubmission = async (submission: SubmissionInformation, feedback: string) => {
    // update submission record in submissions table
    const updatedSubmission = {...submission, status: SubmissionStatus.APPROVED, submissionFeedback: feedback};
    try {
      await updateSubmission(updatedSubmission);
      passResponseProgress?.({waiting: false, response: {isSuccess: true, message: 'Successfully approved submission'}});
      onUpdateSubmission();
    } catch (e) {
      passResponseProgress?.({waiting: false, response: {isSuccess: false, message: 'Error approving submission'}});
    }
    setTimeout(() => {
      passResponseProgress?.({waiting: false, response: {isSuccess: null, message: ''}});
    }, 2000);
  }

  const rejectSubmission = async (submission: SubmissionInformation, feedback: string) => {
    // update submission record in submissions table
    const updatedSubmission = {...submission, status: SubmissionStatus.REJECTED, submissionFeedback: feedback};
    try {
      await updateSubmission(updatedSubmission);
      onUpdateSubmission()
      passResponseProgress?.({waiting: false, response: {isSuccess: true, message: 'Successfully rejected submission'}});
    } catch (e) {
      passResponseProgress?.({waiting: false, response: {isSuccess: false, message: 'Error rejecting submission'}});
    }
    setTimeout(() => {
      passResponseProgress?.({waiting: false, response: {isSuccess: null, message: ''}});
    }, 2000);
  }

  const handleSubmissionMenuClick = (op: string, submission: SubmissionInformation) => {
    switch (op) {
      case 'delete':
        passResponseProgress?.({waiting: true, response: {isSuccess: null, message: ''}});
        deleteSubmissionRecord(submission);
        break;
      case 'download':
        passResponseProgress?.({waiting: true, response: {isSuccess: null, message: ''}});
        downloadSubmission(submission);
        break;
      case 'review':
        setSubmissionReviewing(submission);
        setSubmissionFeedback(submission.submissionFeedback);
        setShowReviewModal(true);
        break;
    }
    handleSubmissionMenuClose(submission.submissionId);
  };

  const handleAdminReviewSubmission = (submission: SubmissionInformation | null, feedback: string, op: string) => {
    if (submission === null) return;
    passResponseProgress?.({waiting: true, response: {isSuccess: null, message: ''}});
    switch (op) {
      case 'approve':
        approveSubmission(submission, feedback);
        break;
      case 'reject':
        rejectSubmission(submission, feedback);
        break;
    }
    setShowReviewModal(false);
  }

  const handleOpenSubmissionMenu = (event: React.MouseEvent, submissionId: string) => {
    setAnchorElMap((prev) => ({ ...prev, [submissionId]: event.currentTarget as HTMLElement }));
    setSubmissionMenuOpenMap((prev) => ({ ...prev, [submissionId]: true }));
  };
  
  const handleSubmissionMenuClose = (submissionId: string) => {
    setAnchorElMap((prev) => ({ ...prev, [submissionId]: null }));
    setSubmissionMenuOpenMap((prev) => ({ ...prev, [submissionId]: false }));
  };

  return (
    <>
      
      <Dialog
        open={showReviewModal}
        fullWidth
        maxWidth='md'
        onClose={()=>{
          setShowReviewModal(false);
          setTimeout(()=> {
            setSubmissionFeedback('');
          setSubmissionReviewing(null);
          },150);
        }}
      >
        <div className="review-dialog">
          <Typography variant='h4'>
            Approve or Reject Submission
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Submission Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Files</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={submissionReviewing?.submissionId}>
                <TableCell>
                  {new Date(Number(submissionReviewing?.timeSubmitted)).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  <div className={`status ${submissionReviewing?.status === SubmissionStatus.PENDING ? "pending" : submissionReviewing?.status === SubmissionStatus.APPROVED ? "approved" : "rejected"}`}>
                    {submissionReviewing?.status === SubmissionStatus.APPROVED ? "Approved" : submissionReviewing?.status === SubmissionStatus.REJECTED ? 'Rejected' : 'Pending approval'}
                  </div>
                </TableCell>
                <TableCell>
                  {submissionReviewing?.submissionFiles?.length ?? 0 > 0
                    ? submissionReviewing?.submissionFiles.map((file) => file?.split('/').pop()).join(", ")
                    : "No Files"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="textfield">
            <Typography>
              Leave feedback:
            </Typography>
            <TextField multiline minRows={5} fullWidth onChange={(e)=>setSubmissionFeedback(e.target.value)} value={submissionFeedback}></TextField>
          </div>
          <div className="buttons">
            <Button className="reject" disableRipple size="large" variant="contained" onClick={() => handleAdminReviewSubmission(submissionReviewing, submissionFeedback, 'reject')}>
              Reject
            </Button>
            <Button className="approve" disableRipple size="large" variant="contained" onClick={() => handleAdminReviewSubmission(submissionReviewing, submissionFeedback, 'approve')}>
              Approve
            </Button>
          </div>
        </div>
      </Dialog>
      <div>
        {sortedSubmissions.map((activity) => (
          <div className="activity-page-section" key={activity.activityName + ' '}>
            <div className="activity-title">
              <Typography variant="h5">
                {activity.activityName}
              </Typography>
            </div>

            <div>
              {activity.subsectionSubmissions.map((subsection) => {
                const totalSubmissions = subsection.submissions.length;
                const pendingSubmissions = subsection.submissions.filter(submission => submission.status === SubmissionStatus.PENDING).length;

                return ( 
                <Accordion key={subsection.subsectionName}>
                  <AccordionSummary
                    expandIcon={<KeyboardArrowDown />}
                    disabled={totalSubmissions === 0}
                  >
                    <div className="subsection-title">
                      <Typography variant="subtitle1">{subsection.subsectionName}</Typography>
                    </div>
                    
                    {!isPersonal && pendingSubmissions > 0 && 
                    <Typography sx={{ marginLeft: "auto", marginRight: '5px', fontStyle: "italic" }}>
                      {`${pendingSubmissions} pending`}
                    </Typography>}
                    
                  </AccordionSummary>
                  <AccordionDetails>
                    {totalSubmissions > 0 ? (
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Submission Time</TableCell>
                            {!isPersonal && <TableCell>Submitted By</TableCell>}
                            <TableCell>Status</TableCell>
                            <TableCell>Feedback</TableCell>
                            <TableCell>Files</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subsection.submissions.map((submission) => {
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
                                {!isPersonal && <TableCell>
                                  {allUsers.find((user) => user.userId === submission.submittedBy)?.identifiers.name}
                                </TableCell>}
                                <TableCell>
                                <div className={`status ${submission.status === SubmissionStatus.APPROVED ? "approved" : submission.status === SubmissionStatus.REJECTED ? 'rejected' : 'pending'}`}>
                                  {submission.status === SubmissionStatus.APPROVED ? "Approved" : submission.status === SubmissionStatus.REJECTED ? 'Rejected' : 'Pending approval'}
                                </div>
                                </TableCell>
                                <TableCell>
                                  {submission.submissionFeedback || 'N/A'}
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
                                    {!isPersonal && <MenuItem disableRipple onClick={() => handleSubmissionMenuClick('review', submission)}>
                                      Review Submission
                                    </MenuItem>}
                                    <MenuItem disableRipple onClick={() => handleSubmissionMenuClick('download', submission)}>
                                      Download Files
                                    </MenuItem>
                                    <MenuItem disableRipple onClick={() => handleSubmissionMenuClick('delete', submission)}>
                                      Delete Submission
                                    </MenuItem>
                                  </Menu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <Typography color="textSecondary">No submissions found.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              )})}
            </div>
          </div>
        ))}
      </div>
    </>
  )
};

export default ReviewProgress;