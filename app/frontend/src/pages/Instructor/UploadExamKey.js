import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";
import { useLocation, Link, useNavigate } from "react-router-dom";

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
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
    formData.append("examKey", file);
    formData.append("examTitle", examTitle);
    formData.append("classID", classID);

    try {
      const responses = await Promise.all([
        await fetch("/api/exam/saveExamKey", {
          method: "POST",
          body: formData,
        }),
        await fetch("/api/exam/copyTemplate", {
          method: "POST",
          credentials: "include",
        }),
      ]);

      const dataSaveExamKey = responses[0].json();
      const dataCopyTemplate = responses[1].json();

      console.log("Data from saveExamKey:", dataSaveExamKey);
      console.log("Data from copyCSV:", dataCopyTemplate);

      navigate("/OMRProcessing", {
        state: {
          examTitle: examTitle,
          classID: classID,
        },
      });
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

export default UploadExamKey;
