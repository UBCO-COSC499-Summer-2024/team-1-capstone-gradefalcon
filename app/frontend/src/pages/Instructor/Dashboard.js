import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Bookmark, ArrowUpRight, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge"; // Import the Badge component
import AverageperExamChart from "../../components/AverageperExamChart";
import AverageperCourseChart from "../../components/AverageperCourseChart";
import NewClassForm from "../../components/NewClassForm";
import NewExamForm from "../../components/NewExamForm";
import { Input } from "../../components/ui/input";

export default function Dashboard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  //const roles = user[`${process.env.REACT_APP_AUTH0_MYAPP}/role`] || [];
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [averageperCourseData, setAverageCourseData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [examSearchTerm, setExamSearchTerm] = useState("");

  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "bg-[hsl(var(--primary))]"; // Using the theme color for Approved
      case false:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include", // This ensures cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
        } else {
          console.error("Failed to fetch session info");
        }
      } catch (error) {
        console.error("Error fetching session info:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Filter out archived courses
          const activeCourses = data.filter((course) => course.active !== false);
          setCourses(activeCourses);
          setFilteredCourses(activeCourses); // Initialize filteredCourses with the fetched data
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/ExamBoard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExams(data.classes);
          setFilteredExams(data.classes); // Initialize filteredExams with the fetched data
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    const fetchStandardAverageData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/average-per-exam", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStandardAverageData(data);
        } else {
          console.error("Failed to fetch standard average data");
        }
      } catch (error) {
        console.error("Error fetching standard average data:", error);
      }
    };

    const fetchAverageCourseData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/average-per-course", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setAverageCourseData(data);
        } else {
          console.error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchSessionInfo();
    fetchCourses();
    fetchExams();
    fetchStandardAverageData();
    fetchAverageCourseData();
  }, [getAccessTokenSilently, isAuthenticated]);

  useEffect(() => {
    setFilteredCourses(courses.filter((course) => course.course_name?.toLowerCase().includes(courseSearchTerm.toLowerCase())));
  }, [courseSearchTerm, courses]);

  useEffect(() => {
    setFilteredExams(exams.filter((exam) => exam.exam_title?.toLowerCase().includes(examSearchTerm.toLowerCase())));
  }, [examSearchTerm, exams]);

  const handleExamCreated = (newExam) => {
    setExams([...exams, newExam]);
  };

  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className={`flex-1 ${filteredCourses.length === 0 ? "h-full" : ""}`}>
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="mb-2">Your Classes</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create New Class</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new course and import the student list via a CSV file.
                      </DialogDescription>
                    </DialogHeader>
                    <NewClassForm />
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button asChild size="sm" className="gap-1">
                  <Link to="/Classes">
                    Manage Classes
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
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
              <div className="flex gap-2">
                <Button size="sm" className="gap-1">
                  <Link to={`/NewExam/defaultClassId`}>
                    <Plus className="h-4 w-4" />
                  </Link>
                </Button>
                {/* <Dialog>
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-1" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create New Exam</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Exam</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new exam and upload the answer key.
                      </DialogDescription>
                    </DialogHeader>
                    <NewExamForm setIsDialogOpen={setIsDialogOpen} onExamCreated={handleExamCreated} />
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog> */}
                <Button asChild size="sm" className="gap-1">
                  <Link to="/Examboard">
                    Manage Exams
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <TableRow
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/ExamDetails/${exam.exam_id}`)}
                          >
                            <TableCell>
                              <span className="font-bold">{exam.exam_title}</span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{exam.course_id}</TableCell>
                            <TableCell>
                              <Badge className={`text-white ${getStatusColor(exam.graded)}`}>
                                {exam.graded ? "Graded" : "Not graded"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click for details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white border rounded">
          <CardHeader>
            <CardTitle>Average Per Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageperExamChart data={standardAverageData} />
          </CardContent>
        </Card>
        <Card className="bg-white border rounded">
          <CardHeader>
            <CardTitle>Average Per Course</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageperCourseChart data={averageperCourseData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
