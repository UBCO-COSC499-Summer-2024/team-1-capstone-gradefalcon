import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Toaster } from "../../components/ui/toaster";

const UploadExam = () => {
  const { exam_id } = useParams();
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Received state:", {
    //   className,
    //   userName,
    //   userID,
    //   examTitle,
    //   examID,
    //   courseID,
    //   classID,
    // });

    const fetchExamType = async () => {
      try {
        const response = await fetch(`/api/exam/getExamType/${exam_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.exam_type);
        setExamType(data.exam_type);
      } catch (error) {
        console.error("Error fetching exam type:", error);
      }
    };

    fetchExamType();

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFile(file);
      }
    };

    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.addEventListener("change", handleFileSelect);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener("change", handleFileSelect);
      }
    };
  }, []);

  const resetUpload = () => {
    setFileURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendToBackend = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("examPages", file);
    formData.append("exam_id", exam_id); // Include exam_id in the form data

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
          body: JSON.stringify({ examType, exam_id }),
        }),
        fetch("/api/exam/copyTemplate", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          // need to create a fetch method to find examType from db
          body: JSON.stringify({ examType: examType, keyOrExam: "exam" }),
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
    <div className="mx-auto grid max-w-[70rem] flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Upload Exam Key
        </h1>
        <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
      </div>

      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-6 bg-white w-full h-[200vh]">
          {!fileURL ? (
            <div className="flex flex-col items-center gap-1 text-center w-full h-full">
              <h3 className="text-2xl font-bold tracking-tight">No File Selected</h3>
              <p className="text-sm text-muted-foreground">
                You can upload the exam answer key as a PDF file.
              </p>
              <Button
                className="mt-4"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                Browse Files
              </Button>
              <input
                type="file"
                id="file-input"
                data-testid="file-input"
                hidden
                accept="application/pdf"
                ref={fileInputRef}
              />
            </div>
          ) : (
            <div className="pdf-display w-full h-full">
              <iframe
                src={fileURL}
                title="PDF Preview"
                className="w-full h-[90vh] border rounded-lg"
              ></iframe>
            </div>
          )}
        </div>
        <div className="flex gap-2 w-full mt-4">
          <Button size="sm" className="gap-1" onClick={sendToBackend}>
            Import
          </Button>
          <Button size="sm" variant="outline" onClick={resetUpload}>
            Reset
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default UploadExam;
