import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';
import '../../css/UploadExamKey.css';

const UploadExamKey = () => {
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

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Answer Key</h2>
          </header>
          <section className="upload-key">
            <button className="back-button" onClick={() => window.history.back()}>&larr;</button>
            <h3>Upload the exam answer key as a PDF file.</h3>
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
            <a href="/ExamControls" className="btn-confirm">Confirm</a>
          </section>
        </div>
      </div>
      </>
  );
};

export default UploadExamKey;