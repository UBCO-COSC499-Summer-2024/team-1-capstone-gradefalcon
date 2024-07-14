import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogto } from '@logto/react';

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const { isAuthenticated, getAccessToken } = useLogto();

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
    if (!file || !isAuthenticated) return;

    const accessToken = await getAccessToken('http://localhost:3000/api/exam/saveExamKey');
    const formData = new FormData();
    formData.append("examKey", file);
    formData.append("examTitle", examTitle);
    formData.append("classID", classID);

    try {
      const saveResponse = await fetch("http://localhost:3000/api/exam/saveExamKey", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (saveResponse.ok) {
        navigate("/ConfirmExamKey");
      } else {
        console.error("Failed to save questions");
      }
    } catch (error) {
      console.error("Error:", error);
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
              />
              <div
                className="drag-drop-area"
                onClick={() => fileInputRef.current.click()}
              >
                <p>Click to browse or drag and drop your files</p>
              </div>
            </div>
            <div
              className="pdf-display"
              style={{ display: fileURL ? "block" : "none" }}
            >
              <iframe src={fileURL} title="PDF Preview"></iframe>
            </div>
            <button className="btn-import" onClick={sendToBackend}>
              Import
            </button>
            <button className="btn-confirm" onClick={resetUpload}>
              Reset
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default UploadExamKey;
