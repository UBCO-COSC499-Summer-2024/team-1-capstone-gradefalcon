import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Checkbox } from "../../components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { useToast } from "../../components/ui/use-toast"; // Importing the useToast hook
import { Toaster } from "../../components/ui/toaster"; // Importing the Toaster component
import { useAuth0 } from "@auth0/auth0-react";
import "../../css/App.css";

const ExamBoard = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [classData, setClassData] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast(); // Using the toast hook
  const navigate = useNavigate(); // Using the navigate hook

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClassData(data); // Set the class data state with the fetched data
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        setError("Error fetching class data: " + error.message);
      }
    };

    fetchClassData();
  }, [getAccessTokenSilently]);

  // Transform classData.classes into a structure that groups exams by course_id
  const groupedExams = (classData.classes || []).reduce((acc, current) => {
    const { course_id, course_name, exam_title, class_id, exam_id } = current;
    if (!acc[course_id]) {
      acc[course_id] = {
        course_name,
        class_id,
        exams: [],
      };
    }
    acc[course_id].exams.push({ exam_title, exam_id });
    return acc;
  }, {});

  const handleDeleteFromBoard = (examId) => {
    setClassData((prevData) => {
      const updatedClasses = prevData.classes.filter((exam) => exam.exam_id !== examId);
      return { ...prevData, classes: updatedClasses };
    });
    toast({
      title: "Deleted successfully",
    });
  };

  const handleDeleteSelected = () => {
    setClassData((prevData) => {
      const updatedClasses = prevData.classes.filter((exam) => !selectedExams.includes(exam.exam_id));
      return { ...prevData, classes: updatedClasses };
    });
    setSelectedExams([]);
    setAllSelected(false);
    toast({
      title: "Deleted selected exams successfully",
    });
  };

  const handleArchiveSelected = () => {
    // Implement archiving logic here
    console.log("Archiving selected exams:", selectedExams);
    // Reset selection after archiving
    setSelectedExams([]);
    setAllSelected(false);
    toast({
      title: "Archived selected exams successfully",
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedExams([]);
    } else {
      const allExamIds = Object.values(groupedExams).flatMap(({ exams }) => exams.map((exam) => exam.exam_id));
      setSelectedExams(allExamIds);
    }
    setAllSelected(!allSelected);
  };

  const handleSelectExam = (examId) => {
    if (selectedExams.includes(examId)) {
      setSelectedExams(selectedExams.filter((id) => id !== examId));
    } else {
      setSelectedExams([...selectedExams, examId]);
    }
  };

  if (error) {
    return <div data-testid="error-message">{error}</div>;
  }

  if ((classData.classes || []).length === 0) {
    return <div data-testid="no-exams">No exams available</div>;
  }

  return (
    <main className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center w-full mb-4">
        <h1 className="text-2xl font-semibold">Exam Board</h1>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button asChild size="sm" className="gap-1">
                <Link to={`/NewExam/defaultClassId`}>
                  <Plus className="h-6 w-6" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create New Exam</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="w-full">
        <Card className="bg-white border rounded">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox checked={allSelected} onCheckedChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grade Exam</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedExams).map(([courseId, { course_name, class_id, exams }]) =>
                  exams.map((exam, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <TableRow
                            key={`${courseId}-${exam.exam_id}`}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/ExamDetails/${exam.exam_id}`)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedExams.includes(exam.exam_id)}
                                onCheckedChange={() => handleSelectExam(exam.exam_id)}
                              />
                            </TableCell>
                            <TableCell>{exam.exam_title}</TableCell>
                            <TableCell>{course_name}</TableCell>
                            <TableCell>
                              <Button asChild size="sm" className="ml-auto gap-1">
                                <Link to={`/UploadExams/${exam.exam_id}`}>
                                  Grade Exam
                                  <ArrowUpRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleDeleteFromBoard(exam.exam_id)}>Delete</DropdownMenuItem>
                                  <DropdownMenuItem>Archive</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => navigate(`/ExamDetails/${exam.exam_id}`)}>
                                    View Results
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Exam</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  );
};

export default ExamBoard;
