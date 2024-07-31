import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, MoreVertical } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../../components/ui/dropdown-menu";
import { Checkbox } from "../../components/ui/checkbox";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import '../../css/App.css';

const ExamBoard = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch(`/api/exam/ExamBoard`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token in the request
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

  const handleDelete = async (examId) => {
    try {
      const token = await getAccessTokenSilently(); // Get the token
      const response = await fetch(`/api/exam/delete/${examId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the request
        },
        credentials: "include",
      });
      if (response.ok) {
        setClassData(prevData => {
          const updatedClasses = prevData.classes.filter(exam => exam.exam_id !== examId);
          return { ...prevData, classes: updatedClasses };
        });
      } else {
        console.error("Failed to delete exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
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
      <div className="w-full">
        <Card className="bg-white border rounded">
          <CardHeader className="flex justify-between px-6 py-4">
            <div>
              <CardTitle className="mb-2">Exam Board</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox />
                  </TableHead>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Grade Exam</TableHead>
                  <TableHead>Create New Exam</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedExams).map(
                  ([courseId, { course_name, class_id, exams }]) => (
                    exams.map((exam, index) => (
                      <TableRow key={`${courseId}-${exam.exam_id}`}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>
                          {exam.exam_title}
                        </TableCell>
                        <TableCell>
                          {course_name}
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" className="ml-auto gap-1">
                            <Link to={`/UploadExams/${exam.exam_id}`}>
                              Grade Exam
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button asChild size="sm" className="ml-auto gap-1">
                            <Link to={`/NewExam/${class_id}`}>
                              Create New
                              <Plus className="h-4 w-4" />
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
                              <DropdownMenuItem onClick={() => handleDelete(exam.exam_id)}>Delete</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ExamBoard;
