import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "../css/App.css";

const OMRProcessingUpload = () => {
  const { exam_id } = useParams();
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const runOMR = async () => {
    console.log("Running OMR");
    try {
      const response = await fetch("/api/exam/callOMR", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log("response", response);
      console.log("data", data);
      console.log("finished");
      setToast({ message: "Sheet successfully added!", type: "success" });
      setTimeout(() => {
        navigate("/ReviewExams", {
          state: { exam_id },
        });
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setToast({ message: "Failed to add sheet!", type: "error" });
    }
  };

  useEffect(() => {
    // Timer stops the ECONREFUSED error
    const timer = setTimeout(() => {
      runOMR();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <style>
          {`
            .App .main-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh; /* Adjust as needed */
            }
          `}
        </style>
        {toast && (
          <>
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
            <style>{`.circle-loader { display: none; }`}</style>
          </>
        )}
        <header>
          <h2>Scanning file</h2>
        </header>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default OMRProcessingUpload;
