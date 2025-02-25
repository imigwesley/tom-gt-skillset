import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, IconButton } from "@mui/material";
import './SubmissionUpload.scss';
import { Close, DeleteOutline } from "@mui/icons-material";

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
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="upload-instructions drag-active">Drop your submission file(s) here...</p>
        ) : (
          <p className="upload-instructions">Drag & drop some files here, or click to select file(s)</p>
        )}
      </div>

      <div className="file-previews">
        {files.length > 0 && (
          <ul style={{listStyleType: 'none'}}>
            {files.map((file, index) => (
              <li className="file-card" key={index}>
                <div>{file.name}</div>
                <div>{(file.size / 1024).toFixed(2) + ' KB'}</div>
                <IconButton onClick={() => handleRemoveFile(index)} className='delete-icon'>
                  <Close />
                </IconButton>
                
              </li>
              // <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
            ))}
          </ul>
        )}
      </div>

      {files.length > 0 && (
        <Button className="upload-btn" onClick={handleUpload}>
          Upload {files.length} file(s)
        </Button>
      )}
    </div>
  );
};

export default SubmissionUpload;
