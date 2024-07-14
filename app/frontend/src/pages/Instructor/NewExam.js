import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import '../../css/App.css';
import "../../css/NewExam.css";

const NewExam = () => {
  const [examTitle, setExamTitle] = useState("");
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [className, setClassName] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const class_id = params.class_id;

  const handleInputChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    setExamTitle(sanitizedValue);
  };

  const isFormValid = () => {
    return examTitle.trim() !== ""; // Simple validation check
  };

  const handleUploadClick = (e) => {
    if (!isFormValid()) {
      e.preventDefault();
      alert('Please enter an exam title before uploading the answer key.');
    }
  };

  useEffect(() => {
    if (location.state) {
      setUserName(location.state.userName);
      setUserID(location.state.userID);
      setClassName(location.state.className);
    }
  }, [location.state]);

  return (
    <>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Create New Exam</h2>
          </header>
          <section className="new-exam">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            ></button>

            <h3>General</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
              <label htmlFor="exam-title">Exam Title:</label>
              <input
                type="text"
                id="exam-title"
                className="input-field"
                placeholder="Enter exam title"
                value={examTitle}
                onChange={handleInputChange}
                data-testid="exam-title-input"
                required
              />

              <label htmlFor="answer-key">Answer Key:</label>
              <div>
                <Link
                  to={isFormValid() ? "/UploadExamKey" : "#"}
                  state={{ examTitle: examTitle, userID: userID, userName: userName, className: className }} // Pass examTitle as state
                  className="btn"
                  data-testid="upload-answer-key-btn"
                  onClick={handleUploadClick}
                >
                  Upload Answer Key
                </Link>
                <Link
                  to={isFormValid() ? "/ManualExamKey" : "#"}
                  state={{ examTitle: examTitle, classID: class_id }} // Pass examTitle as state
                  className="btn"
                  data-testid="manual-answer-key-btn"
                >
                  Manually Select Answers
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default NewExam;
