import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip"; // Assuming this is the correct path

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
    <main className="flex flex-col gap-4 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
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
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link to={`../NewExam/${params.class_id}`} className="ml-auto gap-1">
                      <Button size="sm">+</Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    Create New Exam
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b py-2 text-left px-4">Student ID</th>
                    <th className="border-b py-2 text-left px-4">Student Name</th>
                    {[...Array(maxExams).keys()].map((_, index) => (
                      <th key={index} className="border-b py-2 text-left px-4">Exam {index + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {classData.studentInfo &&
                    classData.studentInfo.map((student) => (
                      <tr key={student.student_id}>
                        <td className="border-b py-2 px-4">{student.student_id}</td>
                        <td className="border-b py-2 px-4">{student.name}</td>
                        {student.exams.map((exam, index) => (
                          <td key={index} className="border-b py-2 px-4">{exam.grade}</td>
                        ))}
                        {[...Array(maxExams - student.exams.length).keys()].map((_, index) => (
                          <td key={index} className="border-b py-2 px-4">-</td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <Button asChild size="sm" className="gap-1" onClick={() => window.history.back()}>
                  <span>Back</span>
                </Button>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button onClick={exportToCSV}>
                        Export
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Export grades as a csv file.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ClassManagement;
