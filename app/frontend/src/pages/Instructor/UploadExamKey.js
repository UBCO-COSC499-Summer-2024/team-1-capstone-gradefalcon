import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../css/App.css';
import '../../css/UploadExam.css';

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const { examTitle, className, userName, userID } = location.state || {};

  useEffect(() => {
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFile(file);
      }
    };

    const fileInput = fileInputRef.current;
    fileInput.addEventListener("change", handleFileSelect);

    return () => {
      fileInput.removeEventListener("change", handleFileSelect);
    };
  }, []);

  const resetUpload = () => {
    setFileURL(null);
    fileInputRef.current.value = "";
  };

  const sendToBackend = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', `${className}/Instructors/${userName}_(${userID})/${examTitle}/AnswerKey`);
    formData.append('examTitle', examTitle);

    try {
      const response = await fetch('/api/upload/uploadExamKey', {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully', data);
        alert('File uploaded successfully');
      } else {
        console.error('File upload failed');
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Answer Key</h2>
          </header>
          <section className="upload-key">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            ></button>
            <h3>Upload the exam answer key as a PDF file.</h3>
            <h2>{examTitle}</h2>
            <div
              className="upload-area"
              style={{ display: fileURL ? "none" : "block" }}
            >
              <input
                type="file"
                id="file-input"
                hidden
                accept="application/pdf"
                ref={fileInputRef}
                data-testid="file-input"
              />
              <div
                className="drag-drop-area"
                onClick={() => fileInputRef.current.click()}
              >
                <p>Click to browse or drag and drop your files</p>
              </div>
            </div>
            <div className="pdf-display" style={{ display: fileURL ? 'block' : 'none' }}>
              <iframe src={fileURL} title="PDF Preview"></iframe>
            </div>
            <button className="btn btn-import" onClick={resetUpload}>Import</button>
            <button className="btn-confirm" onClick={sendToBackend}>Confirm</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default UploadExamKey;
