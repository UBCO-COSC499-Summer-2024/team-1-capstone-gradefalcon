import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import '../../css/App.css';
import {
  Home,
  Bookmark,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "../../components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const ManualExamKey = () => {
  const location = useLocation();
  const { examTitle, classID } = location.state || {};
  const [numQuestions, setNumQuestions] = useState(10);
  const [numOptions, setNumOptions] = useState(5);
  const [numMarks, setNumMarks] = useState(10);
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigate = useNavigate();

  const handleToggleSelection = (question, option) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = { ...prevSelectedOptions };
      if (!newSelectedOptions[question]) {
        newSelectedOptions[question] = [];
      }
      const optionIndex = newSelectedOptions[question].indexOf(option);
      if (optionIndex === -1) {
        newSelectedOptions[question].push(option);
      } else {
        newSelectedOptions[question].splice(optionIndex, 1);
      }
      return newSelectedOptions;
    });
  };

  const renderQuestions = useCallback(() => {
    const bubbleGrid = document.querySelector(".bubble-grid");
    bubbleGrid.innerHTML = "";

    for (let i = 1; i <= numQuestions; i++) {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question";
      questionDiv.innerHTML = `<span>${i})</span><div class="options"></div>`;

      const optionsDiv = questionDiv.querySelector(".options");

      for (let j = 0; j < numOptions; j++) {
        const optionSpan = document.createElement("span");
        optionSpan.className = `option ${selectedOptions[i] && selectedOptions[i].includes(String.fromCharCode(65 + j)) ? 'selected' : ''}`;
        optionSpan.innerText = String.fromCharCode(65 + j);
        optionSpan.onclick = () => handleToggleSelection(i, optionSpan.innerText);
        optionsDiv.appendChild(optionSpan);
      }

      bubbleGrid.appendChild(questionDiv);
    }
  }, [numQuestions, numOptions, selectedOptions]);

  useEffect(() => {
    renderQuestions();
  }, [numQuestions, numOptions, renderQuestions]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        alert("Logged out");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar">
        <div className="logo">
          <ClipboardCheck className="h-6 w-6" />
          <span className="ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
            <Home className="icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
            <BookOpen className="icon" />
            <span>Exam Board</span>
          </Link>
          <Link to="/Classes" className="nav-item" data-tooltip="Classes">
            <Users className="icon" />
            <span>Classes</span>
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="nav-item" data-tooltip="My Account">
                <Settings className="icon" />
                <span>My Account</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/AccountSettings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/NotificationPreferences">Notification Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-4">Create New Exam</h1>
            <h2 className="text-xl mb-4">{examTitle}</h2>
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">Questions</CardTitle>
                    <CardDescription>*The following details will be printed on the exam*</CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <span onClick={() => window.history.back()}>Back</span>
                  </Button>
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
                    <div className="mb-4">
                      <label htmlFor="num-marks" className="block text-sm font-medium text-gray-700">#Total marks:</label>
                      <input
                        type="number"
                        id="num-marks"
                        className="input-field mt-1 block w-full"
                        value={numMarks}
                        onChange={(e) => setNumMarks(e.target.value)}
                        min="1"
                        data-testid="num-marks-input"
                      />
                    </div>
                    <div className="nested-window mb-4">
                      <div className="bubble-grid" data-testid="bubble-grid"></div>
                    </div>
                    <Button asChild size="sm" className="green-button">
                      <Link
                        to="/ExamControls"
                        state={{
                          classID: classID,
                          examTitle: examTitle,
                          questions: Object.keys(selectedOptions).map((question) => ({
                            question: parseInt(question),
                            options: selectedOptions[question],
                          })),
                          numQuestions: numQuestions,
                        }}
                      >
                        Next
                      </Link>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManualExamKey;
