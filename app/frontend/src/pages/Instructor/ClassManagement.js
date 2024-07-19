import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../css/App.css";
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

const ClassManagement = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({ courseDetails: {} });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(`/api/class/classManagement/${params.class_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClassData(data);
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        setError("Error fetching class data");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [params.class_id]);

  const maxExams = classData.studentInfo
    ? classData.studentInfo.reduce((max, student) => Math.max(max, student.exams.length), 0)
    : 0;

  const courseDetails = classData.courseDetails;

  const exportToCSV = () => {
    let csvContent = "";
    csvContent += "Student ID,Student Name," + [...Array(maxExams).keys()].map((i) => `Exam ${i + 1}`).join(",") + "\r\n";

    classData.studentInfo.forEach((student) => {
      let row = [student.student_id, student.name, ...student.exams.map((exam) => exam.grade)];
      for (let i = student.exams.length; i < maxExams; i++) {
        row.push("-");
      }
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    if (link.download !== undefined) {
      link.setAttribute("href", url);
      link.setAttribute("download", `${courseDetails[0].course_id}_results.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            <h1 className="text-3xl font-bold mb-4">
              {courseDetails[0] ? courseDetails[0].course_id : "loading..."}
            </h1>
            <h2 className="text-xl mb-4">
              {courseDetails[0] ? courseDetails[0].course_name : "loading..."}
            </h2>
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">Grades</CardTitle>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1" onClick={() => window.history.back()}>
                    <span>Back</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <Link to={`../NewExam/${params.class_id}`} className="green-button">
                      + New Exam
                    </Link>
                    <Button className="green-button" onClick={exportToCSV}>
                      Export
                    </Button>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b py-2 text-left">Student ID</th>
                        <th className="border-b py-2 text-left">Student Name</th>
                        {[...Array(maxExams).keys()].map((_, index) => (
                          <th key={index} className="border-b py-2 text-left">Exam {index + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classData.studentInfo &&
                        classData.studentInfo.map((student) => (
                          <tr key={student.student_id}>
                            <td className="border-b py-2">{student.student_id}</td>
                            <td className="border-b py-2">{student.name}</td>
                            {student.exams.map((exam, index) => (
                              <td key={index} className="border-b py-2">{exam.grade}</td>
                            ))}
                            {[...Array(maxExams - student.exams.length).keys()].map((_, index) => (
                              <td key={index} className="border-b py-2">-</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="mt-4">Export student grades into a csv file.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassManagement;


