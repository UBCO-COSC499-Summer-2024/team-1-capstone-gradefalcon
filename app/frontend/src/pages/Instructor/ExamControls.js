import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import '../../css/App.css';
import {
  Home,
  Bookmark,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  ArrowUpRight,
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

const ExamControls = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { classID, examTitle, questions, numQuestions } = location.state || {};

  const handleConfirm = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/exam/saveQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classID: classID,
          examTitle: examTitle,
          questions: questions,
          numQuestions: numQuestions,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate("/ExamBoard"); // Navigate to the ExamBoard page
      } else {
        console.error("Failed to save questions");
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
            <h2 className="text-xl mb-4">{examTitle}</h2>
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">Exam Controls</CardTitle>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1" onClick={() => window.history.back()}>
                    <span>Back</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="controls">
                    <div className="control-item">
                      <span>Students can view their exam</span>
                      <label className="switch">
                        <input type="checkbox" data-testid="toggle-view-exam" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="control-item">
                      <span>Students can view correct answers</span>
                      <label className="switch">
                        <input type="checkbox" data-testid="toggle-view-answers" />
                        <span className="slider"></span>
                      </label>
                    </div>
                    <div className="control-item">
                      <span>Students can see exam statistics</span>
                      <label className="switch">
                        <input type="checkbox" data-testid="toggle-view-stats" />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <Button asChild size="sm" className="green-button">
                      <Link to="/ExamBoard">
                        Confirm
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExamControls;
