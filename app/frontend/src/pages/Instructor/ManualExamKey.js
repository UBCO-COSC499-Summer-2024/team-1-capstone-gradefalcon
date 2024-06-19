import React, { useState, useEffect, useCallback } from 'react';
import '../../css/style.css';

const ManualExamKey = () => {
  const [numQuestions, setNumQuestions] = useState(80);
  const [numOptions, setNumOptions] = useState(5);

  const toggleSelection = (event) => {
    event.target.classList.toggle('selected');
  };

  const updateQuestions = useCallback(() => {
    const bubbleGrid = document.querySelector('.bubble-grid');

    bubbleGrid.innerHTML = '';

    for (let i = 1; i <= numQuestions; i++) {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question';
      questionDiv.innerHTML = `<span>${i})</span><div class="options"></div>`;

      const optionsDiv = questionDiv.querySelector('.options');

      for (let j = 0; j < numOptions; j++) {
        const optionSpan = document.createElement('span');
        optionSpan.className = 'option';
        optionSpan.innerText = String.fromCharCode(65 + j);
        optionSpan.onclick = toggleSelection;
        optionsDiv.appendChild(optionSpan);
      }

      bubbleGrid.appendChild(questionDiv);
    }
  }, [numQuestions, numOptions]);

  useEffect(() => {
    updateQuestions();
  }, [numQuestions, numOptions, updateQuestions]);

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
          }

          .btn:hover {
            background-color: #45a049;
          }

          form {
            display: flex;
            flex-direction: column;
          }

          .bubble-grid {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          .question {
            margin: 10px 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }

          .options {
            margin-left: 10px;
            flex: 1;
          }

          .option {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin: 0 5px;
            border-radius: 50%;
            border: 2px solid #333;
            text-align: center;
            line-height: 30px;
            cursor: pointer;
          }

          .option.selected {
            background-color: #4CAF50;
            color: white;
          }

          .nested-window {
            width: 100%;
            height: 400px;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            box-sizing: border-box;
            margin-top: 20px;
          }
        `}
      </style>
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Create New Exam</h2>
          </header>
          <section className="new-exam">
            <button className="back-button" onClick={() => window.history.back()}>&larr; Back</button>
            <h3>Questions</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
              <label htmlFor="num-questions">#Questions:</label>
              <input
                type="number"
                id="num-questions"
                className="input-field"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(300, parseInt(e.target.value)))}
                min="1"
                max="300"
                data-testid="num-questions-input"
              />

              <label htmlFor="num-options">#Options per question:</label>
              <input
                type="number"
                id="num-options"
                className="input-field"
                value={numOptions}
                onChange={(e) => setNumOptions(Math.min(26, parseInt(e.target.value)))}
                min="1"
                max="26"
                data-testid="num-options-input"
              />

              <div className="nested-window">
                <div className="bubble-grid" data-testid="bubble-grid"></div>
              </div>

              <a href="./ExamControls" className="btn">Next</a>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManualExamKey;
