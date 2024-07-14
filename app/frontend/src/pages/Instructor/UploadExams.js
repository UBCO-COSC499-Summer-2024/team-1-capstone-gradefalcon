import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';
import '../../css/UploadExam.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Use ES6 import

const UploadExams = () => {
  const [fileURL, setFileURL] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { className, userName, userID, examTitle, examID } = location.state || {};

  useEffect(() => {
    console.log("Received state:", { className, userName, userID, examTitle, examID });

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
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

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file || !className || !userName || !userID || !examTitle || !examID) {
      console.error("Missing required information for file upload.");
      return;
    }

    const fileName = `${file.name}`;
    const folderPath = `${className}/Instructors/${userName}_(${userID})/${examTitle}/UploadExam`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folderPath);
    formData.append('fileName', fileName);
    formData.append('examID', examID);

    console.log("Sending file upload request with form data:", formData);

    try {
      const response = await axios.post('/api/upload/uploadExam', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Upload response:", response);

      if (response.data.success) {
        alert('File uploaded successfully');
        console.log("File was uploaded successfully!");
      } else {
        alert('File upload failed');
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
          <h2>Upload Exams</h2>
        </header>
        <section className="upload-key">
          <button className="back-button" onClick={() => navigate(-1)}>&larr;</button>
          <h3>Upload the exam with all student submissions as a PDF file.</h3>
          <div className="upload-area" style={{ display: fileURL ? 'none' : 'block' }}>
            <input type="file" id="file-input" hidden accept="application/pdf" ref={fileInputRef} />
            <div className="drag-drop-area" onClick={() => fileInputRef.current.click()}>
              <p>Click to browse or drag and drop your files</p>
            </div>
          </div>
          <div className="pdf-display" style={{ display: fileURL ? 'block' : 'none' }}>
            <iframe src={fileURL} title="PDF Preview"></iframe>
          </div>
          <button className="btn btn-import" onClick={resetUpload}>Reset</button>
          <button className="btn-confirm" onClick={handleFileUpload}>Confirm</button>
        </section>
      </div>
    </div>
  );
};

export default UploadExams;
