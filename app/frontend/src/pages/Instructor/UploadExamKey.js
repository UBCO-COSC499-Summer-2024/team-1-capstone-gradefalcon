import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

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

    try {
      const response = await fetch("/api/exam/saveExamKey", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Handle success, maybe redirect or show a success message
        // navigate("/ExamControls");
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
            {/* This send button is for testing right now. Will need to make it so it redirects */}
            <button className="btn btn-import" onClick={sendToBackend}>
              Send
            </button>
            <button className="btn btn-import" onClick={resetUpload}>
              Import
            </button>
            <a href="/ExamControls" className="btn-confirm">
              Confirm
            </a>
          </section>
        </div>
      </div>
    </>
  );
};

export default UploadExamKey;
