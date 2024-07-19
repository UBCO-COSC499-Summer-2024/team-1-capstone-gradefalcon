import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/App.css';
import {
  Home,
  Bookmark,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  ArrowUpRight,
  BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "../../components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Received state:", {
      className,
      userName,
      userID,
      examTitle,
      examID,
      courseID,
      classID,
    });

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
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    console.log("Sending file upload request with form data:", {
      file,
      folder: `Instructors/${userName}_(${userID})/${courseID}_(${classID})/${examTitle}/AnswerKey`,
      fileName: file.name,
      examID,
      examTitle,
      classID,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "folder",
      `Instructors/${userName}_(${userID})/${courseID}_(${classID})/${examTitle}/AnswerKey`
    );
    formData.append("fileName", file.name);
    formData.append("examID", examID);
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
      console.error("Error uploading file:", error);
      alert("Error uploading file");
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
    <div className="flex min-h-screen">
      <aside className="sidebar">
        <div className="logo">
          <ClipboardCheck className="h-6 w-6" />
          <span className="ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
            <Home className="icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
            <BookOpen className="icon" />
            <span>Exam Board</span>
          </Link>
          <Link to="/Classes" className="nav-item" data-tooltip="Classes">
            <Users className="icon" />
            <span>Classes</span>
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="nav-item" data-tooltip="My Account">
                <Settings className="icon" />
                <span>My Account</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/AccountSettings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/NotificationPreferences">Notification Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-4">Answer Key</h1>
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">General</CardTitle>
                    <CardDescription>Upload the exam answer key as a PDF file.</CardDescription>
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
                    <Button asChild size="sm" className="green-button" onClick={resetUpload}>
                      <span>Import</span>
                    </Button>
                    <Button asChild size="sm" className="green-button">
                      <Link to="/ExamControls">Confirm</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadExamKey;
