import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const ReviewExams = () => {
  const location = useLocation();
  const [studentScores, setStudentScores] = useState([]);
  const [totalMarks, setTotalMarks] = useState();
  // const { exam_id } = location.state || {};
  const navigate = useNavigate(); // Initialize useNavigate
  const exam_id = 1; // placeholder

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

    const fetchTotalScore = async () => {
      try {
        const response = await fetch(`/api/exam/getScoreByExamId/${exam_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.scores[0]);
        setTotalMarks(data.scores[0]);
      } catch (error) {
        console.error("Error fetching total marks:", error);
      }
    };

    fetchStudentScores();
    fetchTotalScore();
  }, []);

  // Function to handle view button click
  const handleViewClick = (studentId) => {
    navigate("/ViewExam", {
      state: { student_id: studentId, exam_id: exam_id },
    });
  };

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
                <th>Score/{totalMarks}</th>
                <th>View Exam</th>
              </tr>
            </thead>
            <tbody>
              {studentScores.map((student, index) => (
                <tr key={index}>
                  <td>{student.StudentName}</td>
                  <td>{student.StudentID}</td>
                  <td>{student.Score}</td>
                  <td>
                    <button onClick={() => handleViewClick(student.StudentID)}>
                      View
                    </button>
                  </td>
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
