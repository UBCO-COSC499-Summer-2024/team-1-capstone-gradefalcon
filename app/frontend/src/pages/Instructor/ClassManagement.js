import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip"; // Assuming this is the correct path
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Plus, FileIcon } from "lucide-react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

const ClassManagement = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const params = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState({ courseDetails: {} });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/class/classManagement/${params.class_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token in the request
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
  }, [params.class_id, getAccessTokenSilently]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <main className="flex flex-col gap-4 p-2">
<div className="w-full mx-auto grid flex-1 auto-rows-max gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {courseDetails[0] ? courseDetails[0].course_id : "loading..."}
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link to={`../NewExam`} className="gap-1">
                  <Button size="sm" className="gap-1">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Create New Exam
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={exportToCSV}>
                  <FileIcon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Export grades as a csv file.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <Card className="bg-white border rounded">
          <CardHeader className="flex justify-between px-6 py-4">
            <div>
              <CardTitle className="mb-2">Grades</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead className="hidden sm:table-cell">Student Name</TableHead>
                    {[...Array(maxExams).keys()].map((_, index) => (
                      <TableHead key={index} className="hidden sm:table-cell">Exam {index + 1}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData.studentInfo && classData.studentInfo.map((student) => (
                    <TableRow key={student.student_id}>
                      <TableCell>
                        <div className="font-medium">{student.student_id}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="text-sm text-muted-foreground">{student.name}</div>
                      </TableCell>
                      {student.exams.map((exam, index) => (
                        <TableCell key={index} className="hidden sm:table-cell">
                          <div className="text-sm text-muted-foreground">{exam.grade}</div>
                        </TableCell>
                      ))}
                      {[...Array(maxExams - student.exams.length).keys()].map((_, index) => (
                        <TableCell key={index} className="hidden sm:table-cell">
                          <div className="text-sm text-muted-foreground">-</div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
    </main>
  );
};

export default ClassManagement;
