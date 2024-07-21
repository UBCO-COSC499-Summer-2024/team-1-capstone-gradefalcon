import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const ReviewExams = () => {
  const [studentScores, setStudentScores] = useState([]);

  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await fetch("/api/exam/studentScores");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStudentScores(data); // Update state with fetched data
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
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {studentScores.map((student, index) => (
                <tr key={index}>
                  <td>{student.StudentName}</td>
                  <td>{student.StudentID}</td>
                  <td>{student.Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ReviewExams;
