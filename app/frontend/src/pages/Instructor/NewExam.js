import React from 'react';
import '../../css/style.css';

const NewExam = () => {
  return (
    <>
      <style>
        {`
          .new-exam {
              background-color: white;
              border-radius: 5px;
              padding: 20px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              box-sizing: border-box;
          }

          .new-exam h3 {
              font-size: 20px;
              font-weight: normal;
              margin-bottom: 10px;
          }

          .new-exam p {
              font-size: 14px;
              margin-bottom: 20px;
              color: #555;
          }

          .input-field {
              width: 100%;
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #ccc;
              border-radius: 5px;
              box-sizing: border-box;
          }

          .schedule-field {
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          .schedule-field input {
              width: 23%;
          }

          .btn {
              background-color: #4CAF50;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 10px;
              display: inline-block;
              text-align: center;
              text-decoration: none;
              margin-right: 10px;
              margin-left: 10px;
          }

          .btn:hover {
              background-color: #45a049;
          }

          form {
              display: flex;
              flex-direction: column;
          }
        `}
      </style>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Create New Exam</h2>
          </header>
          <section className="new-exam">
            <button className="btn">Create</button>
            <button className="btn">Configure</button>
            <button className="btn">Publish</button>
            <h3>General</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
              <label htmlFor="exam-title">Exam Title:</label>
              <input
                type="text"
                id="exam-title"
                className="input-field"
                defaultValue="Graphic Fundamentals 101 Final Exam"
              />

              <label htmlFor="test-duration">Test Duration:</label>
              <input
                type="text"
                id="test-duration"
                className="input-field"
                defaultValue="03:00:00"
              />

              <label htmlFor="schedule">Schedule:</label>
              <div className="schedule-field">
                <input
                  type="date"
                  id="start-date"
                  className="input-field"
                  defaultValue="2024-12-31"
                />
                <input
                  type="time"
                  id="start-time"
                  className="input-field"
                  defaultValue="13:00"
                />
                <input
                  type="date"
                  id="end-date"
                  className="input-field"
                  defaultValue="2024-12-31"
                />
                <input
                  type="time"
                  id="end-time"
                  className="input-field"
                  defaultValue="16:00"
                />
              </div>

              <label htmlFor="answer-key">Answer Key:</label>
              <a href="./UploadExamKey" className="btn">
                Upload Answer Key
              </a>
              <a href="./ManualExamKey" className="btn">
                Manually Select Answers
              </a>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};
export default NewExam;