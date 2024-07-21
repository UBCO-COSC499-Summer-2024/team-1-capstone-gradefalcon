import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const ReviewExams = () => {
  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await fetch("/api/exam/studentScores");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data); // Handle the data as needed
      } catch (error) {
        console.error("Error fetching student scores:", error);
      }
    };

    fetchStudentScores();
  }, []);
  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Review Exams</h2>
          </header>
        </div>
      </div>
    </>
  );
};

export default ReviewExams;
