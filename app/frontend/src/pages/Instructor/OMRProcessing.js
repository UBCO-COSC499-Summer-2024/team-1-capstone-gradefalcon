import React, { useState, useEffect, useCallback } from "react";
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
    console.log("response", response);
    console.log("finished");
  };

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
