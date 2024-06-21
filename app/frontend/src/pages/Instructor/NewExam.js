import React, { useState } from 'react';
import '../../css/style.css';

const NewExam = () => {
  const [examTitle, setExamTitle] = useState('Graphic Fundamentals 101 Final Exam'); //dummy input, will be altered when exam creation is implimented

  const handleInputChange = (event) => {
    const value = event.target.value;
    // blocks chars that could cause error (i.e " ')
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, '');
    setExamTitle(sanitizedValue);
  };

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
            position: relative;
          }

          .back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
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
            <button className="back-button" onClick={() => window.history.back()}>&larr;</button>


            <h3>General</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
              <label htmlFor="exam-title">Exam Title:</label>
              <input
                type="text"
                id="exam-title"
                className="input-field"
                value={examTitle}
                onChange={handleInputChange}
                data-testid="exam-title-input"
              />

              <label htmlFor="answer-key">Answer Key:</label>
              <div>
                <a href="./UploadExamKey" className="btn" data-testid="upload-answer-key-btn">Upload Answer Key</a>
                <a href="./ManualExamKey" className="btn" data-testid="manual-answer-key-btn">Manually Select Answers</a>






























              </div>








            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default NewExam;