import React, { useState, useEffect, useCallback } from 'react';
import '../../css/App.css';
import '../../css/NewExam.css';

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
  );
};

export default ManualExamKey;