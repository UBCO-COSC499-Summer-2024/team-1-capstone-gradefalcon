import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";
import { useParams, useNavigate } from "react-router-dom";

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

  const sendToBackend = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("examPages", file);
    formData.append("exam_id", exam_id); // Include exam_id in the form data

    try {
      const response = await fetch("/api/exam/UploadExam", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        console.error("Error in UploadExam:", data.error);
      } else {
        console.log("Data from UploadExam:", data);
        navigate(`/generate-evaluation/${exam_id}`);
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  };

  return (
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
  );
};

export default UploadExam;