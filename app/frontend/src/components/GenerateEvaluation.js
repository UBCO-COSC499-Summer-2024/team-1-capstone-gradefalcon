import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "../css/App.css";

const GenerateEvaluation = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const generateEvaluation = async () => {
    try {
      const response = await fetch("/api/exam/GenerateEvaluation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exam_id }),
      });
      const data = await response.json();
      if (data.error) {
        console.error("Error in GenerateEvaluation:", data.error);
        setToast({ message: "Failed to generate evaluation!", type: "error" });
      } else {
        console.log("Data from GenerateEvaluation:", data);
        setToast({ message: "Evaluation generated successfully!", type: "success" });
        setTimeout(() => {
          navigate(`/copy-template/${exam_id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      setToast({ message: "Unexpected error occurred!", type: "error" });
    }
  };

  useEffect(() => {
    generateEvaluation();
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <header>
          <h2>Generating Evaluation</h2>
        </header>
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default GenerateEvaluation;
