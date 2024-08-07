import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "../../components/ui/toaster";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";

const UploadExam = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const { exam_id } = useParams();
  const [fileURL, setFileURL] = useState(null);
  const [file, setFile] = useState(null);
  const [examType, setExamType] = useState(null);
  const [numQuestions, setNumQuestions] = useState(null);
  const [examTitle, setExamTitle] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [classId, setClassId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFile(file);
      } else {
        setFileURL(null);
        setFile(null);
        console.error("Please upload a valid PDF file.");
      }
    },
    []
  );

  useEffect(() => {
    const fetchQuestionExamDetails = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/exam/getExamQuestionDetails/${exam_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("API Response Data:", data); // Log the entire response data
        console.log(`Exam Type: ${data.examType}, Total Questions: ${data.totalQuestions}`);
        setExamType(data.examType);
        setNumQuestions(data.totalQuestions); // Rename totalQuestions to numQuestions
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    const fetchExamDetails = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/exam/getExamDetails/${exam_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("API Response Data:", data); // Log the entire response data
        setExamTitle(data.exam_title);
        setCourseId(data.course_id);
        setClassId(data.class_id);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    };

    fetchExamDetails();
    fetchQuestionExamDetails();
  }, [exam_id, getAccessTokenSilently]);

  const resetUpload = () => {
    setFileURL(null);
    setFile(null); // Clear the file state
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Ensure the file input is cleared and ready for new selection
    }
  };

  const sendToBackend = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("examPages", file);
    formData.append("exam_id", exam_id); // Include exam_id in the form data

    try {
      const token = await getAccessTokenSilently(); // Get the token
      const responses = await Promise.all([
        fetch(`/api/exam/UploadExam/${examType}/${numQuestions}`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        }),
        fetch("/api/exam/GenerateEvaluation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
          body: JSON.stringify({ examType, exam_id, numQuestions }), // Pass numQuestions
        }),
        fetch("/api/exam/copyTemplate", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examType,
            keyOrExam: "exam",
            numQuestions,
            examTitle,
            courseId,
            classID: classId,
          }), // Pass numQuestions
        }),
      ]);

      const results = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMessage;

            if (contentType && contentType.includes("application/json")) {
              const errorResponse = await response.json();
              errorMessage = errorResponse.error || "Unknown error occurred";
            } else {
              errorMessage = await response.text();
            }

            throw new Error(errorMessage);
          }

          return response.json(); // Parse the successful JSON response
        })
      );

      const [dataUploadExam, dataGenerateEvaluation, dataCopyTemplate] = results;

      console.log("Data from UploadExam:", dataUploadExam);
      console.log("Data from GenerateEvaluation:", dataGenerateEvaluation);
      console.log("Data from copyTemplate:", dataCopyTemplate);

      navigate("/OMRProcessingUpload", {
        state: { exam_id, numQuestions, examType },
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <main className="flex flex-col gap-4 p-2">
      <div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
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
            Upload Exam
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex"></div>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" onClick={resetUpload}>
              Reset
            </Button>
            <Button size="sm" className="gap-1" onClick={sendToBackend}>
              Import
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-6 bg-white w-full h-[200vh]">
            {!fileURL ? (
              <div className="flex flex-col items-center gap-1 text-center w-full h-full">
                <h3 className="text-2xl font-bold tracking-tight">No File Selected</h3>
                <p className="text-sm text-muted-foreground">
                  You can upload the exam file as a PDF.
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
                  onChange={handleFileSelect} // Attach event handler directly
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
        </div>
        <Toaster />
      </div>
    </main>
  );
};

export default UploadExam;
