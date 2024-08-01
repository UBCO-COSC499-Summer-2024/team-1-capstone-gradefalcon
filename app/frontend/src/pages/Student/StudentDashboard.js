// StudentDashboard.js
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Search, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button"; // Correct import for Button
import { useAuth0 } from "@auth0/auth0-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table"; // Add the correct import statement

export default function StudentDashboard() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [examSearchTerm, setExamSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/student/${user.sub}/courses`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setFilteredCourses(data); // Initialize filteredCourses with the fetched data
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/api/student/${user.sub}/exams`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExams(data.exams);
          setFilteredExams(data.exams); // Initialize filteredExams with the fetched data
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (err) {
        console.error("Error fetching exams:", err);
      }
    };

    fetchCourses();
    fetchExams();
  }, [getAccessTokenSilently, user.sub]);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) =>
        course.course_name?.toLowerCase().includes(courseSearchTerm.toLowerCase())
      )
    );
  }, [courseSearchTerm, courses]);

  useEffect(() => {
    setFilteredExams(
      exams.filter((exam) =>
        exam.exam_title?.toLowerCase().includes(examSearchTerm.toLowerCase())
      )
    );
  }, [examSearchTerm, exams]);

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="mb-2">Your Courses</CardTitle>
            </div>
            <CardDescription>Your enrolled courses.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full pl-8"
                value={courseSearchTerm}
                onChange={(e) => setCourseSearchTerm(e.target.value)}
              />
            </div>
            {filteredCourses.length > 0 ? (
              <ScrollArea className="h-80">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6">
                  {filteredCourses.map((course, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link to={`/ClassManagement/${course.class_id}`}>
                            <Card className="p-4 border rounded-lg flex flex-col justify-between shadow-md max-w-md mx-auto h-30">
                              <div className="flex items-center justify-between mb-4">
                                <CardDescription>{course.course_name}</CardDescription>
                                <Bookmark className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="text-2xl font-bold">{course.course_id}</div>
                              </div>
                            </Card>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to Open Course</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">No courses available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex-1">
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="mb-2">Exam Board</CardTitle>
            </div>
            <CardDescription>Recent exams from your classes.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search exams..."
                className="w-full pl-8"
                value={examSearchTerm}
                onChange={(e) => setExamSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <TableRow
                              className="hover:bg-gray-100 cursor-pointer"
                              onClick={() => navigate(`/ViewExamDetails`)}
                            >
                              <TableCell>
                                <span className="font-bold">{exam.exam_title}</span>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">{exam.course_id}</TableCell>
                              <TableCell>{exam.status}</TableCell>
                              <TableCell>
                                <Button onClick={() => navigate(`/ViewExamDetails`)} className="bg-primary text-white">
                                  <ChevronRight className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click for details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))
                  ) : (
                    <>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No exams available.
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>No exams available</TableCell>
                        <TableCell className="hidden sm:table-cell">No exams available</TableCell>
                        <TableCell>No exams available</TableCell>
                        <TableCell>
                          <Button onClick={() => navigate('/ViewExamDetails')} className="bg-primary text-white">
                            <ChevronRight className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
