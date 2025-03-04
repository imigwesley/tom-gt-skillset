import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, IconButton, Typography } from "@mui/material";
import './SubmissionUpload.scss';
import { Close, DeleteOutline } from "@mui/icons-material";
import "bootstrap-icons/font/bootstrap-icons.css";


const SubmissionUpload = () => {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [], "application/pdf": [], "text/plain": [] },
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const handleUpload = () => {
    console.log("Uploading files:", files);
    // Implement actual upload logic here (e.g., send to an API)
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
                {/* <div>{(file.size / 1024).toFixed(2) + ' KB'}</div> */}
                <div style={{flexGrow: 1}} />
                <IconButton onClick={() => handleRemoveFile(index)} className='delete-icon'>
                  <Close />
                </IconButton>
                
              </div>
              // <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
            ))}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <Button disableRipple className="upload-btn" onClick={handleUpload}>
          <Typography color="white">
            Upload {files.length} file(s)
          </Typography>
        </Button>
      )}
    </div>
  );
};

export default SubmissionUpload;
