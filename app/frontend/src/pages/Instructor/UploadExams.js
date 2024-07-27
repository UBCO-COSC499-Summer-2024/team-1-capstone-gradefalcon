import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useParams, useNavigate } from "react-router-dom";

const UploadExam = () => {
  const { exam_id } = useParams();
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
    formData.append("exam_id", exam_id);

    try {
      const responses = await Promise.all([
        fetch("/api/exam/UploadExam", {
          method: "POST",
          body: formData,
        }),
        fetch("/api/exam/GenerateEvaluation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ exam_id }),
        }),
        fetch("/api/exam/copyTemplate", {
          method: "POST",
          credentials: "include",
        }),
      ]);

      const dataUploadExam = await responses[0].json();
      const dataGenerateEvaluation = await responses[1].json();
      const dataCopyTemplate = await responses[2].json();

      console.log("Data from UploadExam:", dataUploadExam);
      console.log("Data from GenerateEvaluation:", dataGenerateEvaluation);
      console.log("Data from copyTemplate:", dataCopyTemplate);

      navigate("/OMRProcessingUpload", {
        state: { exam_id },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <Card className="upload-card">
          <CardHeader>
            <CardTitle>Upload Exam</CardTitle>
            <CardDescription>Upload the exam as a PDF file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="back-button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <div
              className="upload-area"
              style={{ display: fileURL ? "none" : "block" }}
            >
              <Input
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
                style={{
                  border: "2px dashed #4CAF50",
                  borderRadius: "5px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <p>Click to browse or drag and drop your files</p>
              </div>
            </div>
            <div
              className="pdf-display"
              style={{ display: fileURL ? "block" : "none" }}
            >
              <iframe src={fileURL} title="PDF Preview" style={{ width: "100%", height: "500px" }}></iframe>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
              <Button className="btn-import" onClick={sendToBackend}>
                Import
              </Button>
              <Button className="btn-confirm" variant="outline" onClick={resetUpload}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UploadExam;