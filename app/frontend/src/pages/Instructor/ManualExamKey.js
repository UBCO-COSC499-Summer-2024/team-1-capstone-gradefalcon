import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";

const ManualExamKey = () => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(5);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { toast } = useToast();

  const removeQuestion = (questionNumber, option) => {
    setSelectedOptions(prevOptions =>
      prevOptions.filter(
        question => question.question !== questionNumber || question.option !== option
      )
    );
  };

  const toggleSelection = (selection) => (event) => {
    event.target.classList.toggle("selected");
    if (event.target.classList.contains("selected")) {
      event.target.style.backgroundColor = "hsl(var(--primary))";
      event.target.style.color = "white";
      setSelectedOptions(prevOptions => {
        if (!prevOptions.some(question => question.question === selection.question && question.option === selection.option)) {
          toast({ title: "Added", description: `Added: ${selection.question} ${selection.option}` });
          return [...prevOptions, selection];
        } else {
          return prevOptions;
        }
      });
    } else {
      event.target.style.backgroundColor = "";
      event.target.style.color = "";
      setSelectedOptions(prevOptions => {
        const newOptions = prevOptions.filter(question => question.question !== selection.question || question.option !== selection.option);
        toast({ title: "Removed", description: `Removed: ${selection.question} ${selection.option}` });
        return newOptions;
      });
    }
  };

  const updateQuestions = useCallback(() => {
    const bubbleGrid = document.querySelector(".bubble-grid");

    bubbleGrid.innerHTML = "";

    for (let i = 1; i <= numQuestions; i++) {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question mb-4";
      questionDiv.innerHTML = `<span>${i})</span><div class="options flex space-x-2"></div>`;

      const optionsDiv = questionDiv.querySelector(".options");

      for (let j = 0; j < numOptions; j++) {
        const optionSpan = document.createElement("span");
        optionSpan.className = "option cursor-pointer px-2 py-1 border rounded";
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
        <main className="flex flex-col gap-4 px-8 pb-8 pt-2 bg-gradient-to-r from-gradient-start to-gradient-end">
          <h2 className="text-2xl font-semibold mb-2">Manual Exam Key</h2>
          <h3 className="text-xl mb-2">{examTitle}</h3>
          <Card className="bg-white border rounded">
            <CardHeader className="px-6 py-4">
              <CardTitle>Questions</CardTitle>
              <CardDescription>*The following details will be printed on the exam*</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="mb-4">
                  <label htmlFor="num-questions" className="block text-sm font-medium text-gray-700">#Questions:</label>
                  <Input
                    type="number"
                    id="num-questions"
                    className="mt-1 block w-full"
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
                  <Input
                    type="number"
                    id="num-options"
                    className="mt-1 block w-full"
                    value={numOptions}
                    onChange={(e) =>
                      setNumOptions(Math.min(26, parseInt(e.target.value)))
                    }
                    min="1"
                    max="26"
                    data-testid="num-options-input"
                  />
                </div>
                <div className="nested-window">
                  <div className="bubble-grid" data-testid="bubble-grid"></div>
                </div>
                <div className="flex justify-between mt-4">
                  <Button size="sm" className="gap-1 green-button" onClick={() => window.history.back()}>
                    Back
                  </Button>
                  <Link
                    to="/ExamControls"
                    state={{
                      classID: classID,
                      examTitle: examTitle,
                      questions: selectedOptions,
                      numQuestions: numQuestions,
                    }}
                  >
                    <Button size="sm" className="gap-1 green-button">
                      Next
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
        <Toaster />
      </div>
    </>
  );
};

export default ManualExamKey;