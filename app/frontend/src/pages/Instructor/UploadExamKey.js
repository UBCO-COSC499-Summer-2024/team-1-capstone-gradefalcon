import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';
import '../../css/UploadExam.css';
import { useNavigate, useLocation } from 'react-router-dom';

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { className, userName, userID, examTitle, examID, courseID, classID } = location.state || {};

  useEffect(() => {
    console.log("Received state:", { className, userName, userID, examTitle, examID, courseID, classID });

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFile(file);
      }
    };

    const fileInput = fileInputRef.current;
    fileInput.addEventListener('change', handleFileSelect);

    return () => {
      fileInput.removeEventListener('change', handleFileSelect);
    };
  }, []);

  const resetUpload = () => {
    setFileURL(null);
    fileInputRef.current.value = '';
  };

  const sendToBackend = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Sending file upload request with form data:", {
      file,
      folder: `Instructors/${userName}_(${userID})/${courseID}_(${classID})/${examTitle}/AnswerKey`,
      fileName: file.name,
      examID,
      examTitle,
      classID
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `Instructors/${userName}_(${userID})/${courseID}_(${classID})/${examTitle}/AnswerKey`);
    formData.append('fileName', file.name);
    formData.append('examID', examID);
    formData.append('examTitle', examTitle);
    formData.append('classID', classID);

    try {
      const response = await fetch('/api/upload/uploadExamKey', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      console.log('File uploaded successfully', data);
      alert('File uploaded successfully');

      // Call the /copyTemplate endpoint
      const templateResponse = await fetch('/api/exam/copyTemplate', {
        method: 'POST',
        credentials: 'include',
      });

      if (templateResponse.ok) {
        console.log('Template copied successfully');
        alert('Template copied successfully');
        navigate('/OMRProcessing', { state: { examTitle, classID } });
      } else {
        console.error('Failed to copy template');
        alert('Failed to copy template');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Answer Key</h2>
        </header>
        <section className="upload-key">
          <button className="back-button" onClick={() => navigate(-1)}>&larr;</button>
          <h3>Upload the exam answer key as a PDF file.</h3>
          <div className="upload-area" style={{ display: fileURL ? 'none' : 'block' }}>
            <input type="file" id="file-input" hidden accept="application/pdf" ref={fileInputRef} data-testid="file-input" />
            <div className="drag-drop-area" onClick={() => fileInputRef.current.click()}>
              <p>Click to browse or drag and drop your files</p>
            </div>
          </div>
          <div className="pdf-display" style={{ display: fileURL ? 'block' : 'none' }}>
            <iframe src={fileURL} title="PDF Preview"></iframe>
          </div>
          <button className="btn btn-import" onClick={resetUpload}>Reset</button>
          <button className="btn-confirm" onClick={sendToBackend}>Confirm</button>
        </section>
      </div>
    </div>
  );
};

export default UploadExamKey;
