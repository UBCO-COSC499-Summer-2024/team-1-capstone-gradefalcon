import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowUpRight, Plus, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../components/ui/tooltip";
import AverageperExamChart from "../../components/AverageperExamChart";
import AverageperCourseChart from "../../components/AverageperCourseChart";
import NewClassForm from "../../components/NewClassForm";
import NewExamForm from "../../components/NewExamForm"; // Import the new exam form
import { Input } from "../../components/ui/input";

export default function Dashboard() {
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

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
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
        const response = await fetch("/api/class/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setFilteredCourses(data); // Initialize filteredCourses with the fetched data
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("Error fetching courses");
      }
    };

    const fetchExams = async () => {
      try {
        const response = await fetch("/api/exam/ExamBoard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        console.error("Error fetching exams");
      }
    };

    const fetchStandardAverageData = async () => {
      try {
        const response = await fetch("/api/exam/average-per-exam", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Standard Average Data:", data);
          setStandardAverageData(data);
        } else {
          console.error("Failed to fetch standard average data");
        }
      } catch (error) {
        console.error("Error fetching standard average data");
      }
    };

    const fetchAverageCourseData = async () => {
      try {
        const response = await fetch("/api/exam/average-per-course", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Average Course Data:", data);
          setAverageCourseData(data);
        } else {
          console.error("Failed to fetch average course data");
        }
      } catch (error) {
        console.error("Error fetching average course data", error);
      }
    };

    fetchSessionInfo();
    fetchCourses();
    fetchExams();
    fetchStandardAverageData();
    fetchAverageCourseData();
  }, []);

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

  const handleExamCreated = (newExam) => {
    setExams([...exams, newExam]);
  };
  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className={`flex-1 ${filteredCourses.length === 0 ? "h-full" : ""}`}>
        <Card className="bg-white border rounded h-full">
          <CardHeader className="flex justify-between px-6 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="mb-2">Your Courses</CardTitle>
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
                        <p>Create New Course</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Course</DialogTitle>
                      <DialogDescription>Enter the details for the new course and import the student list via a CSV file.</DialogDescription>
                    </DialogHeader>
                    <NewClassForm />
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
                <Button asChild size="sm" className="gap-1">
                  <Link to="/Classes">
                    Manage Courses
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
                <Dialog>
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
                      <DialogDescription>Enter the details for the new exam and upload the answer key.</DialogDescription>
                    </DialogHeader>
                    <NewExamForm setIsDialogOpen={setIsDialogOpen} onExamCreated={handleExamCreated} />
                    <DialogClose asChild>
                      <Button variant="ghost">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam, index) => (
                    <TableRow key={index} className={index}>
                      <TableCell>
                        <div className="font-medium">{exam.exam_title}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{exam.course_id}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{exam.course_id}</TableCell>
                    </TableRow>
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

