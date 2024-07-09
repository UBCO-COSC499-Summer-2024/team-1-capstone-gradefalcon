import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { useLocation, Link } from "react-router-dom";
import "../../css/App.css";
import "../../css/ManualExamKey.css";

const allowedExtensions = ["csv"];

const ConfirmExamKey = (props) => {
  const location = useLocation();
  // const { examTitle, classID } = location.state || {};
  // test data
  const examTitle = "Test Exam";
  const classID = 1;

  const [fields, setFields] = useState({});

  let questions = [];

  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(5);
  const [numMarks, setNumMarks] = useState(10);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const sampleQuestionsAndAnswers = {
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          let data = result.data[0];
          console.log("Parsed Result:", data);
          setFields(getFilledQs(data));
          setNumQuestions(getQuestionCount(getFilledQs(data)));
          console.log(getFilledQs(data));
          // clickAnswersForQuestions(Object.entries(getFilledQs(data)));
          clickAnswersForQuestions(getFilledQs(data));
        },
        header: true, // Set to true if your data has column headers
      });
    }
  };

  function clickAnswersForQuestions(questionsAndAnswers) {
    Object.entries(questionsAndAnswers).forEach(([questionNumber, answer]) => {
      toggleQuestionAnswer(questionNumber, answer);
    });
  }

  function getFilledQs(data) {
    // Filter out entries without answer
    const filteredEntries = Object.entries(data).filter(
      ([key, value]) => value !== undefined && value !== ""
    );

    // Sort
    const sortedEntries = filteredEntries.sort(
      (a, b) => parseInt(a[0]) - parseInt(b[0])
    );

    // We only want the questions so we skip file_id, input_path, output_path, and score
    const entriesAfterSkipping = sortedEntries.slice(4);

    // Convert back into object
    const transformedEntries = entriesAfterSkipping.map(([key, value]) => [
      Number(key.substring(1)),
      value,
    ]);
    const result = Object.fromEntries(transformedEntries);
    return result;
  }

  function getQuestionCount(data) {
    return Object.keys(data)[Object.keys(data).length - 1];
  }

  const removeQuestion = (questionNumber, option) => {
    questions = questions.filter(
      (question) =>
        question.question !== questionNumber || question.option !== option
    );
  };

  const toggleSelection = (selection) => (event) => {
    event.target.classList.toggle("selected");
    if (!questions.includes(selection)) {
      questions.push(selection);
      console.log(`Added: ${selection.question} ${selection.option}`);
    } else {
      removeQuestion(selection.question, selection.option);
      console.log(`Removed: ${selection.question} ${selection.option}`);
    }
    console.log(questions);
  };

  function toggleQuestionAnswer(questionNumber, answer) {
    // Find the question div by its index (questionNumber - 1 because it's 1-indexed)
    const questionDiv = document.querySelector(
      `.bubble-grid .question:nth-child(${questionNumber})`
    );
    if (!questionDiv) {
      console.error(`Question ${questionNumber} not found.`);
      return;
    }

    // Find the option span within the question div that matches the answer
    const optionSpan = Array.from(questionDiv.querySelectorAll(".option")).find(
      (span) => span.innerText === answer
    );
    if (!optionSpan) {
      console.error(
        `Option ${answer} in question ${questionNumber} not found.`
      );
      return;
    }

    // Simulate a click event on the option span
    optionSpan.click();
  }

  const updateQuestions = useCallback(() => {
    const bubbleGrid = document.querySelector(".bubble-grid");

    bubbleGrid.innerHTML = "";

    for (let i = 1; i <= numQuestions; i++) {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.innerHTML = `<span>${i})</span><div class="options"></div>`;

      const optionsDiv = questionDiv.querySelector(".options");

      for (let j = 0; j < numOptions; j++) {
        const optionSpan = document.createElement("span");
        optionSpan.className = "option";
        optionSpan.innerText = String.fromCharCode(65 + j);
        optionSpan.onclick = toggleSelection({
          question: i,
          option: optionSpan.innerText,
        });
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
      <div className="App">
        <div className="main-content">
          <header>
            <h2>Confirm Exam Key</h2>
          </header>
          <section className="new-exam">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              {" "}
              Back
            </button>

            <h3>Questions</h3>
            <p>*The following details will be printed on the exam*</p>

            <form>
              <label htmlFor="num-questions">#Questions:</label>
              <input
                type="number"
                id="num-questions"
                className="input-field"
                value={numQuestions}
                onChange={(e) =>
                  setNumQuestions(Math.min(300, parseInt(e.target.value)))
                }
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
                onChange={(e) =>
                  setNumOptions(Math.min(26, parseInt(e.target.value)))
                }
                min="1"
                max="26"
                data-testid="num-options-input"
              />

              <label htmlFor="num-marks">#Total marks:</label>
              <input
                type="number"
                id="num-marks"
                className="input-field"
                value={numMarks}
                onChange={(e) => setNumMarks(e.target.value)}
                min="1"
                data-testid="num-marks-input"
              />

              <input type="file" accept=".csv" onChange={handleFileChange} />

              <div className="nested-window">
                <div className="bubble-grid" data-testid="bubble-grid"></div>
              </div>

              <Link
                to="/ExamControls"
                state={{
                  classID: classID,
                  examTitle: examTitle,
                  questions: questions,
                  numQuestions: numQuestions,
                }}
                className="btn"
              >
                Next
              </Link>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConfirmExamKey;
