import React, { useState, useRef, useEffect } from 'react';
import '../../css/App.css';

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
      <style>
        {`
          .upload-key {
            background-color: white;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            text-align: center;
            position: relative;
          }
          .back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
          }
          .upload-area {
            text-align: center;
          }
          .drag-drop-area {
            width: 100%;
            height: 200px;
            border: 2px dashed #ccc;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #777;
            cursor: pointer;
            margin-bottom: 20px;
          }
          .drag-drop-area:hover {
            background-color: #f9f9f9;
          }
          .btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
          }
          .btn:hover {
            background-color: #45a049;
          }
          .btn-confirm {
            background-color: #ccc;
            color: black;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
          }
          .btn-confirm:hover {
            background-color: #bbb;
          }
          .pdf-display {
            width: 100%;
            height: 600px;
            border: 2px dashed #ccc;
            border-radius: 5px;
            overflow: hidden;
            margin-bottom: 20px;
            display: none;
          }
          .pdf-display iframe {
            width: 100%;
            height: 100%;
          }
        `}
      </style>
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