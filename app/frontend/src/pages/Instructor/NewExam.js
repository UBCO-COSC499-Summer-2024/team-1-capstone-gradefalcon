import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

const NewExam = () => {
  const [examTitle, setExamTitle] = useState("");
  const params = useParams();
  const class_id = params.class_id;
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s.,!?-]/g, "");
    setExamTitle(sanitizedValue);
  };

  const isFormValid = () => {
    return examTitle.trim() !== "";
  };

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
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">General</CardTitle>
                    <CardDescription>*The following details will be printed on the exam*</CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <span onClick={() => window.history.back()}>Back</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="exam-title" className="block text-sm font-medium text-gray-700">Exam Title:</label>
                      <input
                        type="text"
                        id="exam-title"
                        className="input-field mt-1 block w-full"
                        placeholder="Enter exam title"
                        value={examTitle}
                        onChange={handleInputChange}
                        data-testid="exam-title-input"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="answer-key" className="block text-sm font-medium text-gray-700">Answer Key:</label>
                      <div className="flex gap-4 mt-1">
                        <Button asChild size="sm" className="green-button">
                          <Link to="/UploadExamKey" data-testid="upload-answer-key-btn">
                            Upload Answer Key
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="green-button">
                          <Link to={isFormValid() ? "/ManualExamKey" : "#"} state={{ examTitle: examTitle, classID: class_id }} data-testid="manual-answer-key-btn">
                            Manually Select Answers
                          </Link>
                        </Button>
                      </div>
                    </div>
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

export default NewExam;
