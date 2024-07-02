import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';
import '../../css/UploadExam.css';
import axios from 'axios'; // You need to install axios if you haven't already

const UploadExams = () => {
  const [fileURL, setFileURL] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
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
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload-exam', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('File uploaded successfully');
        // Redirect or update the state as needed
      } else {
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
            <h2>Upload Exams</h2>
          </header>
          <section className="upload-key">
            <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
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
            <button className="btn btn-import" onClick={resetUpload}>Import</button>
            <button className="btn-confirm" onClick={handleFileUpload}>Confirm</button>
          </section>
        </div>
      </div>
    </>
  );
};

export default UploadExams;
