import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { Label } from "../../components/ui/label";
import { Form } from "../../components/ui/form";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { MultiSelect } from "../../components/ui/multi-select";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

const ManualExamKey = () => {
  const location = useLocation();
  const { examTitle, classID, courseId, template, numQuestions: initialNumQuestions } = location.state || {};  // Extract numQuestions
  const [numQuestions, setNumQuestions] = useState(initialNumQuestions || 10);
  const [numOptions, setNumOptions] = useState(5);
  const [totalMarks, setTotalMarks] = useState();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [markingSchemes, setMarkingSchemes] = useState([]);
  const [showCustomSchemeModal, setShowCustomSchemeModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [customScheme, setCustomScheme] = useState({
    questions: [],
    correct: 0,
    incorrect: 0,
    unmarked: 0,
  });

  const frameworks = Array.from({ length: numQuestions }, (_, j) => ({
    value: `Question ${j + 1}`,
    label: `Q${j + 1}`,
  }));

  const removeQuestion = (questionNumber, option) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter(
        (question) => question.question !== questionNumber || question.option !== option
      )
    );
  };

  const toggleSelection = (selection) => (event) => {
    event.target.classList.toggle("selected");
    if (event.target.classList.contains("selected")) {
      event.target.style.backgroundColor = "hsl(var(--primary))";
      event.target.style.color = "white";
      setSelectedOptions((prevOptions) => {
        if (
          !prevOptions.some(
            (question) =>
              question.question === selection.question && question.option === selection.option
          )
        ) {
          return [...prevOptions, selection];
        } else {
          return prevOptions;
        }
      });
    } else {
      event.target.style.backgroundColor = "";
      event.target.style.color = "";
      setSelectedOptions((prevOptions) => {
        const newOptions = prevOptions.filter(
          (question) =>
            question.question !== selection.question || question.option !== selection.option
        );
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
        // Check if this option is selected and apply styles
        if (
          selectedOptions.some(
            (question) =>
              question.question === i && question.option === optionSpan.innerText
          )
        ) {
          optionSpan.classList.add("selected");
          optionSpan.style.backgroundColor = "hsl(var(--primary))";
          optionSpan.style.color = "white";
        }

        optionsDiv.appendChild(optionSpan);
      }

      bubbleGrid.appendChild(questionDiv);
    }
  }, [numQuestions, numOptions, selectedOptions]);

  useEffect(() => {
    setTotalMarks(numQuestions);
    updateQuestions();
  }, [numQuestions, numOptions, updateQuestions]);

  const handleSelectChange = (values) => {
    setCustomScheme((prev) => ({
      ...prev,
      questions: values,
    }));
  };

  const addNewQuestion = () => {
    setNumQuestions((prev) => prev + 1);
  };

  const handleAddCustomScheme = () => {
    if (customScheme.questions.length === 0) {
      setShowAlert(true);
      return;
    } else {
      setShowAlert(false);
    }

    const formattedQuestions = customScheme.questions.map((q) => `q${q.split(" ")[1]}`);

    setMarkingSchemes((prev) => [
      ...prev,
      {
        questions: formattedQuestions,
        correct: Math.abs(customScheme.correct),
        incorrect: -Math.abs(customScheme.incorrect),
        unmarked: -Math.abs(customScheme.unmarked),
      },
    ]);
    setShowCustomSchemeModal(false);
    setCustomScheme({
      questions: [],
      correct: 0,
      incorrect: 0,
      unmarked: 0,
    });
  };

  const handleSchemeChange = (index, field, value) => {
    setMarkingSchemes((prev) => {
      const newSchemes = [...prev];
      newSchemes[index] = {
        ...newSchemes[index],
        [field]: field === "correct" ? Math.abs(value) : -Math.abs(value),
      };
      return newSchemes;
    });
  };

  const handleDeleteScheme = (index) => {
    setMarkingSchemes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex flex-col gap-4 p-2">
  <div className="w-full mx-auto flex items-center gap-8">
    <Button
      variant="outline"
      size="icon"
      className="h-10 w-10"
      onClick={() => window.history.back()}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="sr-only">Back</span>
    </Button>
    <h1 className="flex-1 text-3xl font-semibold tracking-tight">Manual Exam Key</h1>
    <div className="flex items-center gap-2 ml-auto">
      <Link
        to="/ExamControls"
        state={{
          classID: classID,
          examTitle: examTitle,
          questions: selectedOptions,
          numQuestions: numQuestions,
          totalMarks: totalMarks,
          markingSchemes: markingSchemes,
          template: template,
        }}
      >
        <Button size="icon" className="h-10 w-10">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  </div>

      <div className="flex flex-row gap-8 w-full">
        <Card className="bg-white border rounded-lg p-6 w-full md:w-1/2">
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
                onChange={(e) => setNumQuestions(Math.min(300, parseInt(e.target.value) || 10))}
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
                onChange={(e) => setNumOptions(Math.min(26, parseInt(e.target.value) || 5))}
                min="1"
                max="26"
                data-testid="num-options-input"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border rounded-lg w-full md:w-1/2 p-6">
          <CardHeader className="flex justify-between px-6 py-4">
            <CardTitle>Custom Marking Scheme</CardTitle>
            <CardDescription>Set the marking scheme for your questions. By default, the total mark match the number of questions. You can adjust the total mark manually below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Questions</TableHead>
                  <TableHead>Correct</TableHead>
                  <TableHead>Incorrect</TableHead>
                  <TableHead>Blank</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {markingSchemes.map((scheme, index) => (
                  <TableRow key={index}>
                    <TableCell>{scheme.questions.join(", ")}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={scheme.correct}
                        className="w-full"
                        onChange={(e) => handleSchemeChange(index, "correct", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={scheme.incorrect}
                        className="w-full"
                        onChange={(e) => handleSchemeChange(index, "incorrect", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={scheme.unmarked}
                        className="w-full"
                        onChange={(e) => handleSchemeChange(index, "unmarked", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteScheme(index)}>
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="justify-center border-t p-4">
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={() => setShowCustomSchemeModal(true)}
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              Add Custom Marking Scheme
            </Button>
          </CardFooter>
          <div className="mt-4"> 
          <Label>
            Total Marks
          </Label>
          <Input
            type="number"
            value={totalMarks}
            className = "w-15"
            onChange={(e) => setTotalMarks(e.target.value)}
          />
        </div>
        </Card>
      </div>

      <Card className="bg-white border rounded-lg w-full md:w-full p-0 md:h-auto">
        <CardHeader className="flex flex-row items-center bg-muted/50 px-6 py-4 w-full">
          <div>
            <CardTitle>Bubble Grid</CardTitle>
            <CardDescription>Select the answers</CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-1"></div>
        </CardHeader>
        <CardContent className="h-[48rem] flex items-center justify-center p-6">
          <ScrollArea className="h-full w-full">
            <Form className="h-full w-full flex items-center justify-center">
              <div className="nested-window w-full">
                <div className="bubble-grid h-full" data-testid="bubble-grid"></div>
              </div>
            </Form>
          </ScrollArea>
        </CardContent>
      </Card>

      {showCustomSchemeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            {showAlert && (
              <Alert className="mb-4">
                <ExclamationCircleIcon className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>Please select a question.</AlertDescription>
              </Alert>
            )}
            <h2 className="text-lg font-semibold mb-4">Add Custom Marking Scheme</h2>
            <div className="mb-4">
              <Label>Questions</Label>
              <MultiSelect
                options={frameworks}
                onValueChange={handleSelectChange}
                defaultValue={customScheme.questions}
                placeholder="Select questions..."
                variant="inverted"
                maxCount={10}
                animation={2}
              />
            </div>
            <div className="mb-4">
              <Label>
                Correct
                <PlusIcon className="h-5 w-5" />
              </Label>
              <Input
                type="number"
                value={customScheme.correct}
                onChange={(e) => setCustomScheme({ ...customScheme, correct: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label>
                Incorrect
                <MinusIcon className="h-5 w-5" />
              </Label>
              <Input
                type="number"
                value={customScheme.incorrect}
                onChange={(e) => setCustomScheme({ ...customScheme, incorrect: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <Label>
                Blank
                <MinusIcon className="h-5 w-5" />
              </Label>
              <Input
                type="number"
                value={customScheme.unmarked}
                onChange={(e) => setCustomScheme({ ...customScheme, unmarked: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCustomSchemeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomScheme}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ManualExamKey;
