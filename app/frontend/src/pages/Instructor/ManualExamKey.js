import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import '../../css/App.css';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import {Label} from "../../components/ui/label";
import { Form } from "../../components/ui/form";
import { ScrollArea } from "../../components/ui/scroll-area";

const ManualExamKey = () => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(5);
  const [selectedOptions, setSelectedOptions] = useState([]);

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
  <div className="mx-auto grid max-w-[70rem] flex-1 auto-rows-max gap-8 px-8 pb-8 pt-2 bg-gradient-to-r from-gradient-start to-gradient-end">
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => window.history.back()}>
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="sr-only">Back</span>
      </Button>
      <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
        Manual Exam Key
      </h1>
      <div className="flex items-center gap-2 ml-auto">
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
    </div>

    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center">
      <Card className="bg-white border rounded-lg p-6 w-full md:w-1/3">
        <CardHeader className="flex justify-between px-6 py-4">
          <CardTitle>Questions</CardTitle>
          <CardDescription>Configure exam questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="num-questions" className="block text-sm font-medium text-gray-700">
              #Questions
            </Label>
            <Input
              type="number"
              id="num-questions"
              className="mt-1 block w-full"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Math.min(300, parseInt(e.target.value)))}
              min="1"
              max="300"
              data-testid="num-questions-input"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="num-options" className="block text-sm font-medium text-gray-700">
              #Options per question
            </Label>
            <Input
              type="number"
              id="num-options"
              className="mt-1 block w-full"
              value={numOptions}
              onChange={(e) => setNumOptions(Math.min(26, parseInt(e.target.value)))}
              min="1"
              max="26"
              data-testid="num-options-input"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border rounded-lg p-6 w-full md:w-2/3">
        <CardHeader className="flex justify-between px-6 py-4">
          <CardTitle>Bubble Grid</CardTitle>
          <CardDescription>Select the answers</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center"> {/* Centered bubble grid */}
          <ScrollArea className="h-full w-full">
            <Form className="h-full w-full flex items-center justify-center">
              <div className="nested-window w-full">
                <div className="bubble-grid h-full" data-testid="bubble-grid"></div> {/* Made bubble-grid take full height */}
              </div>
            </Form>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
);

  
};

export default ManualExamKey;