import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import { Progress } from "../components/ui/progress";
import { useToast } from "../components/ui/use-toast";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import "../css/App.css";

const OMRProcessingUpload = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0); // Initial progress value for visibility
  const { exam_id, examType, numQuestions } = location.state || {};
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAccessTokenSilently } = useAuth0(); // Get the token

  const runOMR = async () => {
    console.log("Running OMR");
    try {
      const token = await getAccessTokenSilently(); // Get the token
      const response = await fetch("/api/exam/callOMR", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the request
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log("response", response);
      console.log("data", data);
      console.log("finished");

      // Set the progress to 100% only after the OMR processing is complete
      setProgress(100);

      toast({
        title: "Sheet successfully added!",
        description: "The OMR sheet was added successfully.",
        type: "success",
      });

      // Navigate to the next page after a short delay to show the toast notification
      setTimeout(() => {
        navigate("/ReviewExams", {
          state: { exam_id, examType, numQuestions },
        });
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Failed to add sheet!",
        description: "An error occurred while adding the OMR sheet.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    // Simulate the progress of the OMR processing
    const timer = setTimeout(() => {
      setProgress(50); // Simulate initial progress
      runOMR();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastProvider>
      <div className="App">
        <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gradient-start to-gradient-end">
          <h2 className="text-2xl font-semibold mb-2">Scanning file</h2>
          <Progress value={progress} className="w-1/2 mb-4 h-4" />
          {progress === 100 ? (
            <p className="text-green-600 mt-4">OMR processing completed. Redirecting...</p>
          ) : (
            <p className="text-gray-600 mt-4">OMR processing in progress...</p>
          )}
          <ToastViewport />
        </main>
      </div>
    </ToastProvider>
  );
};

export default OMRProcessingUpload;
