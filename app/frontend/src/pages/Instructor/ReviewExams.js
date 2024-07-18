import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const ReviewExams = () => {
  const location = useLocation();
  const { examID, examTitle } = location.state || {};
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchScores = async () => {
    //   try {
    //     const response = await fetch(`/api/exam/scores?examID=${examID}`, {
    //       method: "GET",
    //       credentials: "include",
    //     });
    //     const data = await response.json();
    //     setStudents(data);
    //   } catch (error) {
    //     console.error("Error fetching scores:", error);
    //   }
    // };

    // fetchScores();
  }, [examID]);

  const viewGradedExam = (studentId) => {
    navigate(`/GradedExam`, {
      state: {
        studentId: studentId,
        examID: examID,
      },
    });
  };

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>{examTitle} - Exam Scores</h2>
          </header>
          <section className="exam-scores">
            <ul>
              {students.map((student) => (
                <li key={student.id}>
                  <span>{student.name}: {student.score}</span>
                  <button onClick={() => viewGradedExam(student.id)}>
                    View Submission
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default ReviewExams;
