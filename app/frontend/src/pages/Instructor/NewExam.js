import React, { useState } from 'react';
import '../../css/App.css';
import '../../css/NewExam.css';
const NewExam = () => {
  const [examTitle, setExamTitle] = useState('Graphic Fundamentals 101 Final Exam'); //dummy input, will be altered when exam creation is implimented

  const handleInputChange = (event) => {
    const value = event.target.value;
    // blocks chars that could cause error (i.e " ')
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, '');
    setExamTitle(sanitizedValue);
  };

  return (
+
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
  );
};

export default NewExam;