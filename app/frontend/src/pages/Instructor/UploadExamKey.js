import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import "../../css/UploadExam.css";

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
    fileInput.addEventListener("change", handleFileSelect);

    return () => {
      fileInput.removeEventListener("change", handleFileSelect);
    };
  }, []);

  const resetUpload = () => {
    setFileURL(null);
    fileInputRef.current.value = "";
  };

  const uploadFileToBackend = async () => {
    if (!fileURL) {
      alert("No file selected");
      return;
    }

    // Assuming you have the file stored in state after selection
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    // Create FormData and append the file
    const formData = new FormData();
    formData.append("examKey", file); // 'file' is the key your backend expects

    try {
      // Replace 'your-backend-endpoint' with the actual endpoint
      const response = await fetch("saveExamKey", {
        method: "POST",
        body: formData,
        // Do not set content-type header for FormData
        // The browser will set it with the proper boundary
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
      // Handle success scenario (e.g., showing a success message)
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error scenario (e.g., showing an error message)
    }
  };

  // Add this function call to an event handler, like an 'Upload' button click

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
            >
              &larr;
            </button>
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
