import React, { useState, useEffect, useCallback, useReducer } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../../css/App.css";

const OMRProcessing = (props) => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const navigate = useNavigate();

  const runOMR = async () => {
    console.log("Running OMR");
    const response = await fetch("/api/exam/callOMR", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    console.log("response", response);
    console.log("data", data);
    console.log("finished");
    navigate("/ConfirmExamKey", {
      state: {
        examTitle: examTitle,
        classID: classID,
      },
    });
  };

  useEffect(() => {
    // Timer stops the ECONREFUSED error
    const timer = setTimeout(() => {
      runOMR();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Scanning file</h2>
          </header>
        </div>
      </div>
    </>
  );
};

export default OMRProcessing;
