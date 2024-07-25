import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";
import { useLocation, useParams, Link, useNavigate } from "react-router-dom";

const UploadExam = () => {
  const { exam_id } = useParams(); // Retrieve exam_id from URL parameters
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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


  function wait(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
  }

  
  const fetchWithTimeout = (url, options, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
      
      fetch(url, options)
        .then(response => response.json())
        .then(data => {
          clearTimeout(timer);
          resolve(data);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };
  
  const sendToBackend = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("examPages", file);
    formData.append("exam_id", exam_id); // Include exam_id in the form data
  
    const fetchWithTimeoutAndDelay = (url, options, timeout = 1000, delay = 1000) => {
      return fetchWithTimeout(url, options, timeout)
        .then(data => wait(delay, data));
    };
  
    try {
      const uploadExamPromise = fetchWithTimeoutAndDelay("/api/exam/UploadExam", {
        method: "POST",
        body: formData,
      });
  
      const generateEvaluationPromise = fetchWithTimeoutAndDelay("/api/exam/GenerateEvaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam_id }),
      });
  
      const copyTemplatePromise = fetchWithTimeoutAndDelay("/api/exam/copyTemplate", {
        method: "POST",
        credentials: "include",
      });
  
      const [dataUploadExam, dataGenerateEvaluation, dataCopyTemplate] = await Promise.all([
        uploadExamPromise.catch(error => ({ error })),
        generateEvaluationPromise.catch(error => ({ error })),
        copyTemplatePromise.catch(error => ({ error }))
      ]);
  
      if (dataUploadExam.error) {
        console.error("Error in UploadExam:", dataUploadExam.error);
      } else {
        console.log("Data from UploadExam:", dataUploadExam);
      }
  
      if (dataGenerateEvaluation.error) {
        console.error("Error in GenerateEvaluation:", dataGenerateEvaluation.error);
      } else {
        console.log("Data from GenerateEvaluation:", dataGenerateEvaluation);
      }
  
      if (dataCopyTemplate.error) {
        console.error("Error in copyTemplate:", dataCopyTemplate.error);
      } else {
        console.log("Data from copyTemplate:", dataCopyTemplate);
      }
  
      navigate("/OMRProcessingUpload", {
        state: { exam_id },
      });
  
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };
  
  
  
  

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Upload Exam</h2>
          </header>
          <section className="upload-key">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            ></button>
            <h3>Upload the exam as a PDF file.</h3>
            <div
              className="upload-area"
              style={{ display: fileURL ? "none" : "block" }}
            >
              <input
                type="file"
                id="file-input"
                data-testid="file-input"
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

export default UploadExam;
