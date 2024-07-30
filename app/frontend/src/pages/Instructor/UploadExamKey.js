import React, { useState, useRef, useEffect } from "react";
import "../../css/App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";

const UploadExamKey = () => {
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const { className, userName, userID, examTitle, examID, courseID, classID, template } =
    location.state || {};
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Received state:", {
      className,
      userName,
      userID,
      examTitle,
      examID,
      courseID,
      classID,
      template,
    });

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFile(file);
        toast({ title: "File Uploaded", description: "PDF file has been selected successfully." });
      } else {
        toast({ title: "Invalid File", description: "Please upload a valid PDF file." });
      }
    };

    const fileInput = fileInputRef.current;
    fileInput.addEventListener("change", handleFileSelect);

    return () => {
      fileInput.removeEventListener("change", handleFileSelect);
    };
  }, [toast]);

  const resetUpload = () => {
    setFileURL(null);
    fileInputRef.current.value = "";
    toast({ title: "Reset", description: "File upload has been reset." });
  };

  const sendToBackend = async () => {
    if (!file) {
      toast({ title: "No File", description: "No file selected to upload." });
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
    formData.append("examKey", file);
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
        await fetch(`/api/exam/saveExamKey/${template}`, {
          method: "POST",
          body: formData,
        }),
        fetch("/api/exam/copyTemplate", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ examType: template, keyOrExam: "key" }),
        }),
      ]);

      const dataSaveExamKey = await responses[0].json();
      const dataCopyTemplate = await responses[1].json();

      console.log("Data from saveExamKey:", dataSaveExamKey);
      console.log("Data from copyCSV:", dataCopyTemplate);

      toast({
        title: "Upload Successful",
        description: "The file has been uploaded successfully.",
      });

      navigate("/OMRProcessing", {
        state: {
          examTitle: examTitle,
          classID: classID,
          template: template,
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Upload Failed", description: "An error occurred while uploading the file." });
    }
  };

  return (
    <>
      <div className="App">
        <main className="flex flex-col gap-4 px-8 pb-8 pt-2 bg-gradient-to-r from-gradient-start to-gradient-end">
          <h2 className="text-2xl font-semibold mb-2">Upload Exam Key</h2>
          <h3 className="text-xl mb-2">{examTitle}</h3>
          <Card className="bg-white border rounded">
            <CardHeader className="px-6 py-4">
              <div>
                <CardTitle>Answer Key</CardTitle>
                <CardDescription>*Upload the exam answer key as a PDF file*</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="upload-area" style={{ display: fileURL ? "none" : "block" }}>
                  <input
                    type="file"
                    id="file-input"
                    data-testid="file-input"
                    hidden
                    accept="application/pdf"
                    ref={fileInputRef}
                  />
                  <div
                    className="drag-drop-area border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <p>Click to browse or drag and drop your files</p>
                  </div>
                </div>
                <div className="pdf-display" style={{ display: fileURL ? "block" : "none" }}>
                  <iframe
                    src={fileURL}
                    title="PDF Preview"
                    className="w-full h-96 border rounded-lg"
                  ></iframe>
                </div>
                <div className="flex justify-between">
                  <Button size="sm" className="gap-1" onClick={sendToBackend}>
                    Import
                  </Button>
                  <Button size="sm" className="gap-1" onClick={resetUpload}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <div className="flex justify-center mt-4">
          <Button size="sm" className="gap-1" onClick={() => window.history.back()}>
            Back
          </Button>
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default UploadExamKey;
