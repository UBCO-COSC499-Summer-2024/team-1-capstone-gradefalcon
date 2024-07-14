import React, { useState, useEffect, useCallback, useReducer } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../css/App.css";

const OMRProcessing = (props) => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};

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
          <button className="btn-confirm" onClick={runOMR}>
            Run omr
          </button>
          <Link
            to="/ConfirmExamKey"
            state={{
              examTitle: examTitle,
              classID: classID,
            }}
            className="btn-import"
          >
            Confirm Exam Key
          </Link>
        </div>
      </div>
    </>
  );
};

export default OMRProcessing;
