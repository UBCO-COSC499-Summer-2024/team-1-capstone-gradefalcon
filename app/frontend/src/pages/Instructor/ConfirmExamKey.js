import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component

const ConfirmExamKey = (props) => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const [fields, setFields] = useState({});

  let questions = [];

  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(5);
  const { toast } = useToast();

  const downloadCsv = async () => {
    try {
      const response = await fetch("/api/exam/getResults", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response from getResults", response);
      const data = await response.json();
      const dataCsv = data.csv_file[0];
      console.log("dataCSV", dataCsv);
      setFields(getFilledQs(dataCsv));
      setNumQuestions(getQuestionCount(getFilledQs(dataCsv)));
      console.log(getFilledQs(dataCsv));
      toggleQuestionAnswer(1, "E"); // bug fix, still selects the correct option
      clickAnswersForQuestions(getFilledQs(dataCsv));
    } catch (error) {
      console.error("Error downloading CSV: ", error);
      toast({
        title: "Error",
        description: "Failed to download CSV.",
        type: "error",
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
    } else {
      removeQuestion(selection.question, selection.option);
    }
  };

  function toggleQuestionAnswer(questionNumber, answer) {
    const questionDiv = document.querySelector(
      `.bubble-grid .question:nth-child(${questionNumber})`
    );
    if (!questionDiv) {
      console.error(`Question ${questionNumber} not found.`);
      return;
    }

    const optionSpan = Array.from(questionDiv.querySelectorAll(".option")).find(
      (span) => span.innerText === answer
    );
    if (!optionSpan) {
      console.error(
        `Option ${answer} in question ${questionNumber} not found.`
      );
      return;
    }

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

  useEffect(() => {
    downloadCsv();
  }, []);

  return (
    <>
      <div className="App">
        <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gradient-start to-gradient-end">
          <h2 className="text-2xl font-semibold mb-2">Confirm Exam Key</h2>
          <Card className="bg-white border rounded w-3/4">
            <CardHeader className="px-6 py-4">
              <CardTitle className="mb-2">Exam Details</CardTitle>
              <CardDescription>*The following details will be printed on the exam*</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="mb-4">
                  <label htmlFor="num-questions" className="block text-sm font-medium text-gray-700">#Questions:</label>
                  <input
                    type="number"
                    id="num-questions"
                    className="input-field mt-1 block w-full"
                    value={numQuestions}
                    onChange={(e) =>
                      setNumQuestions(Math.min(300, parseInt(e.target.value)))
                    }
                    min="1"
                    max="300"
                    data-testid="num-questions-input"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="num-options" className="block text-sm font-medium text-gray-700">#Options per question:</label>
                  <input
                    type="number"
                    id="num-options"
                    className="input-field mt-1 block w-full"
                    value={numOptions}
                    onChange={(e) =>
                      setNumOptions(Math.min(26, parseInt(e.target.value)))
                    }
                    min="1"
                    max="26"
                    data-testid="num-options-input"
                  />
                </div>
                <div className="nested-window mb-4">
                  <div className="bubble-grid" data-testid="bubble-grid"></div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button size="sm" className="gap-1 green-button" onClick={() => window.history.back()}>
                    Back
                  </Button>
                  <Button asChild size="sm" className="gap-1 green-button">
                    <Link
                      to="/ExamControls"
                      state={{
                        classID: classID,
                        examTitle: examTitle,
                        questions: questions,
                        numQuestions: numQuestions,
                      }}
                    >
                      Next
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
        <Toaster /> {/* Adding the Toaster component */}
      </div>
    </>
  );
};

export default ConfirmExamKey;
