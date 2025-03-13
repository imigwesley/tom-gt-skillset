import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, IconButton, Typography } from "@mui/material";
import './SubmissionUpload.scss';
import { Close } from "@mui/icons-material";
import "bootstrap-icons/font/bootstrap-icons.css";
import { uploadFile } from "../../utils/imagesApi";
import { MemberInformation, SubmissionInformation } from "../../Types/types";
import { v4 as uuidv4 } from "uuid";
import { SubmissionUploadProps } from "../../Types/props";
import { getSingleUserData, updateSingleUserData } from "../../utils/userApi";
import { createSubmission } from "../../utils/submissionApi";



const SubmissionUpload = ({loggedInUser, subsection, currActivity, passResponseProgress}: SubmissionUploadProps) => {
  const activityName = currActivity;
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "application/pdf": [], "text/plain": [] },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });


  const handleUploadForIndividual = async () => {
    passResponseProgress({waiting: true, response: {isSuccess: null, message: ''}});
    try {
      // Upload files to S3
      console.log("Uploading files:", files);
      const filePaths: string[] = await Promise.all(
        files.map(async (file) => {
          return (await uploadFile(file, false)) || '';
        })
      );
      console.log('file paths are ', filePaths);

      // Create submission record and save to DB
      const submissionRecord: SubmissionInformation = {
        submissionId: uuidv4(),
        subsectionName: subsection,
        timeSubmitted: new Date().getTime().toString(),
        isApproved: null,
        submittedBy: loggedInUser?.username || '',
        submissionFiles: filePaths
      };

      console.log('creating submission with ', submissionRecord)
      const submissionResponse = await createSubmission(submissionRecord);
      console.log('submission response is', submissionResponse);

      // Update person's information with submission information
      const singleUserResponse = await getSingleUserData(loggedInUser?.username);
      if (!singleUserResponse || singleUserResponse.length === 0) {
        console.error("User data not found");
        return;
      }
      const tempCurrUser: MemberInformation = singleUserResponse[0];
      console.log('tempCurrUser is', tempCurrUser)

      const currActivityProgress = tempCurrUser.progress.find((prog) => prog.activityName === activityName);
      console.log('currActivityProgress is ', currActivityProgress);

      if (currActivityProgress) {
        // Found progress for this activity
        const currSubsectionProgress = currActivityProgress.subsectionProgress.find((sub) => sub.subsection === subsection);
        
        if (currSubsectionProgress) {
          // Adding another submission
          currSubsectionProgress.submissionIds.push(submissionRecord.submissionId);
        } else {
          // First submission for this subsection
          currActivityProgress.subsectionProgress.push({
            subsection: subsection,
            submissionIds: [submissionRecord.submissionId]
          });
        }
      } else {
        // No progress for this activity yet, create a new progress entry
        tempCurrUser.progress.push({
          activityName: activityName || '',
          subsectionProgress: [
            {
              subsection: subsection,
              submissionIds: [submissionRecord.submissionId]
            }
          ]
        });
      }

      console.log('updating single user data with ', tempCurrUser);
      const updatingResponse = await updateSingleUserData(tempCurrUser);
      console.log('updating response is, ', updatingResponse);

      passResponseProgress({waiting: false, response: {isSuccess: true, message: 'Successfully submitted.'}});
      setTimeout(() => {
        passResponseProgress({
          waiting: false, 
          response: {
            isSuccess: null,
            message: ''
          }
        });
      }, 2000);
    } catch (error) {
      passResponseProgress({waiting: false, response: {isSuccess: false, message: 'Error submitting! Please try again.'}});
      setTimeout(() => {
        passResponseProgress({
          waiting: false, 
          response: {
            isSuccess: null,
            message: ''
          }
        });
      }, 2000);
      console.error("Error in handleUploadForIndividual:", error);
    }
  };


  const handleRemoveFile = (index: number) => {
    const newFiles = [...(files || [])];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="drag-drop-container">
      <div
        {...getRootProps()}
        className={`drop-area ${isDragActive ? 'active' : ''}`}
      >
        <i className="bi bi-cloud-upload cloud-icon"></i>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body2" className="upload-instructions drag-active">Drop your submission file(s) here...</Typography>
        ) : (
          <Typography variant="body2" className="upload-instructions">Drag & drop file(s) here or click to select</Typography>
        )}
      </div>
      <div className="file-previews">
        {files.length > 0 && (
          <div className="file-cards-container" style={{listStyleType: 'none'}}>
            {files.map((file, index) => (
              <div className="file-card" key={index}>
                <div>{file.name + '  -  ' + (file.size / 1048576).toFixed(2) + ' MB'}</div>
                <div style={{flexGrow: 1}} />
                <IconButton onClick={() => handleRemoveFile(index)} className='delete-icon'>
                  <Close />
                </IconButton>
                
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='upload-button'>
        {files.length > 0 && (
          <Button className='btn submit' variant="contained" disableRipple onClick={handleUploadForIndividual}>
              Upload {files.length} file(s)
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubmissionUpload;
