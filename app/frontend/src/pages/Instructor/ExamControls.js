import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import '../../css/App.css';
import "../../css/ExamControls.css";
import { useLogto } from '@logto/react';

const ExamControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classID, examTitle, questions, numQuestions } = location.state || {};
  const { isAuthenticated, getAccessToken } = useLogto();

  const handleConfirm = async (event) => {
    event.preventDefault();
    if (isAuthenticated) {
      const accessToken = await getAccessToken('http://localhost:3000/api/exam/saveQuestions');
      try {
        const response = await fetch("http://localhost:3000/api/exam/saveQuestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            classID: classID,
            examTitle: examTitle,
            questions: questions,
            numQuestions: numQuestions,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error("Failed to save questions");
        }
      } catch (error) {
        console.error("Error:", error);
      }
      navigate("/ExamBoard");
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Create New Exam</h2>
          <h2>{examTitle}</h2>
        </header>
        <section className="exam-controls">
          <button
            className="back-button"
            onClick={() => window.history.back()}
          ></button>

          <div className="controls">
            <div className="control-item">
              <span>Students can view their exam</span>
              <label className="switch">
                <input type="checkbox" data-testid="toggle-view-exam" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-item">
              <span>Students can view correct answers</span>
              <label className="switch">
                <input type="checkbox" data-testid="toggle-view-answers" />
                <span className="slider"></span>
              </label>
            </div>
            <div className="control-item">
              <span>Students can see exam statistics</span>
              <label className="switch">
                <input type="checkbox" data-testid="toggle-view-stats" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <Link
            to="/ExamBoard"
            className="btn"
            data-testid="confirm-btn"
            onClick={handleConfirm}
          >
            Confirm
          </Link>
        </section>
      </div>
    </div>
  );
};

export default ExamControls;
