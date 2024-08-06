import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Checkbox } from "../../components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { useToast } from "../../components/ui/use-toast";
import { Toaster } from "../../components/ui/toaster";
import { Badge } from "../../components/ui/badge";
import { useAuth0 } from "@auth0/auth0-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import "../../css/App.css";

const ExamBoard = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [classData, setClassData] = useState([]);
  const [selectedExams, setSelectedExams] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "default";
      case false:
        return "destructive";
      default:
        return "secondary";
    }
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        setError("Error fetching class data: " + error.message);
      }
    };

    fetchClassData();
  }, [getAccessTokenSilently]);

  const groupedExams = (classData.classes || []).reduce((acc, current) => {
    const { course_id, course_name, exam_title, class_id, exam_id, graded } = current;
    if (!acc[course_id]) {
      acc[course_id] = {
        course_name,
        class_id,
        exams: [],
      };
    }
    acc[course_id].exams.push({ exam_title, exam_id, graded });
    return acc;
  }, {});

  const deleteExam = async (examId) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`/api/exam/delete-exam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ exam_id: examId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete exam");
      }

      handleDeleteFromBoard(examId);
    } catch (error) {
      setError("Error deleting exam: " + error.message);
    }
  };

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

  const filteredExams = Object.entries(groupedExams).flatMap(([courseId, { course_name, class_id, exams }]) => {
    switch (filter) {
      case "graded":
        return exams.filter((exam) => exam.graded).map((exam) => ({ ...exam, course_name }));
      case "not_graded":
        return exams.filter((exam) => !exam.graded).map((exam) => ({ ...exam, course_name }));
      case "all":
      default:
        return exams.sort((a, b) => b.graded - a.graded).map((exam) => ({ ...exam, course_name }));
    }
  });

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
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="not_graded">Not Graded</TabsTrigger>
        </TabsList>
        <TabsContent value={filter}>
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
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.map((exam) => (
                      <TableRow key={exam.exam_id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedExams.includes(exam.exam_id)}
                            onCheckedChange={() => handleSelectExam(exam.exam_id)}
                          />
                        </TableCell>
                        <TableCell>{exam.exam_title}</TableCell>
                        <TableCell>{exam.course_name}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(exam.graded)}>{exam.graded ? "Graded" : "Not graded"}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => deleteExam(exam.exam_id)}>Delete</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/ExamDetails/${exam.exam_id}`)}>View Results</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (!exam.graded) {
                                    navigate(`/UploadExams/${exam.exam_id}`);
                                  } else {
                                    toast({ title: "Error", description: "This exam has already been graded." });
                                  }
                                }}
                              >
                                Grade Exam
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster />
    </main>
  );
};

export default ExamBoard;
