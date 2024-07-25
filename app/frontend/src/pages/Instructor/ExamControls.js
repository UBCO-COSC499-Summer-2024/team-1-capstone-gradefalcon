import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import '../../css/App.css';
import "../../css/ExamControls.css";

const ExamControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classID, examTitle, questions, numQuestions } = location.state || {};
  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/exam/saveQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classID: classID,
          examTitle: examTitle,
          questions: questions,
          numQuestions: numQuestions,
        }),
      });
      console.log(response);
      
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log(data);
          // Handle success, maybe redirect or show a success message
        } else {
          // Handle non-JSON response
          console.log("Response was not JSON");
        }
      } else {
        // Handle error, maybe show an error message
        console.error("Failed to save questions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    navigate("/ExamBoard");
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
            </div>
            {/* <button
              className="btn"
              data-testid="confirm-btn"
              onClick={handleConfirm}
            >
              Confirm
            </button> */}
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
