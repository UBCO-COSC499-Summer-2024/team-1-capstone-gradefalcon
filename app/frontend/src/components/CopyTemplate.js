import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "../css/App.css";

const CopyTemplate = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const copyTemplate = async () => {
    console.log("Starting copyTemplate function"); // Log start of function

    // Adding a delay before making the fetch request
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2000 ms delay

    try {
      const response = await fetch("/api/exam/copyTemplate", {
        method: "POST",
        credentials: "include",
      });

      console.log("Response received from /api/exam/copyTemplate", response); // Log response

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data received from /api/exam/copyTemplate", data); // Log data

      if (data.error) {
        console.error("Error in copyTemplate:", data.error);
        setToast({ message: "Failed to copy template!", type: "error" });
      } else {
        console.log("Template copied successfully");
        setToast({ message: "Template copied successfully!", type: "success" });
        setTimeout(() => {
          console.log("Navigating to OMRProcessingUpload with exam_id:", exam_id);
          navigate(`/omr-processing/${exam_id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      setToast({ message: "Unexpected error occurred!", type: "error" });
    }
  };

  useEffect(() => {
    copyTemplate();
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <header>
          <h2>Copying Template</h2>
        </header>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default CopyTemplate;
