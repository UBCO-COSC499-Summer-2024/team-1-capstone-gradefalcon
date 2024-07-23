import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const UploadExams = () => {
  const [fileURL, setFileURL] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    alert('File reset successfully');
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/uploadExam', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('File uploaded successfully');
        navigate("/Examboard");
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Logged out");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
      <div>
        <h1 className="text-3xl font-bold mb-4">Upload Exams</h1>
        <div className="grid gap-4 lg:grid-cols-1">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">General</CardTitle>
                <CardDescription>Upload the exam with all student submissions as a PDF file.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <span onClick={() => window.history.back()}>Back</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="upload-area" style={{ display: fileURL ? 'none' : 'block' }}>
                <input type="file" id="file-input" hidden accept="application/pdf" ref={fileInputRef} />
                <div className="drag-drop-area" onClick={() => fileInputRef.current.click()}>
                  <p>Click to browse or drag and drop your files</p>
                </div>
              </div>
              <div className="pdf-display" style={{ display: fileURL ? 'block' : 'none' }}>
                <iframe src={fileURL} title="PDF Preview"></iframe>
              </div>
              <div className="flex gap-4 mt-4">
                <Button size="sm" className="green-button" onClick={resetUpload}>
                  <span>Reset</span>
                </Button>
                <Button size="sm" className="green-button" onClick={handleFileUpload}>
                  <span>Upload</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default UploadExams;
