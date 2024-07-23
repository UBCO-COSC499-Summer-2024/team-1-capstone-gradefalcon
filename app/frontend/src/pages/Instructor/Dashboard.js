import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ArrowUpRight, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import AverageperExamChart from "../../components/AverageperExamChart";
import AverageperCourseChart from "../../components/AverageperCourseChart";
import NewClassForm from "./NewClassForm";
import NewExamForm from "./NewExamForm"; // Import the new exam form

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [averageperCourseData, setAverageCourseData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        console.error("Error fetching average course data:", error);
      }
    };

    fetchSessionInfo();
    fetchCourses();
    fetchExams();
    fetchStandardAverageData();
    fetchAverageCourseData();
  }, []);

  const handleExamCreated = (newExam) => {
    setExams([...exams, newExam]);
  };

  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">Your Courses</CardTitle>
                <CardDescription>Your enrolled courses.</CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="ml-auto gap-1">
                      <Plus className="h-4 w-4" />
                      Create Course
                    </Button>
                  </DialogTrigger>
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
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link to="/ClassManagement">
                    Manage Courses
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-6">
                  {courses.map((course, index) => (
                    <Card key={index} className="p-4 border rounded-lg flex flex-col justify-between shadow-md">
                      <div className="flex items-center justify-between mb-4">
                        <CardDescription>{course.course_name}</CardDescription>
                        <Bookmark className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold">{course.course_id}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        <div className="flex-1">
          <Card className="bg-white border rounded">
            <CardHeader className="flex justify-between px-6 py-4">
              <div>
                <CardTitle className="mb-2">Exam Board</CardTitle>
                <CardDescription>Recent exams from your classes.</CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="ml-auto gap-1" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Create New
                    </Button>
                  </DialogTrigger>
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
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link to="/Examboard">
                    Manage Exams
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Course</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam, index) => (
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
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white border rounded">
          <CardHeader>
            <CardTitle>Standard Average Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageperExamChart data={standardAverageData} />
          </CardContent>
        </Card>
        <Card className="bg-white border rounded">
          <CardHeader>
            <CardTitle>Performance Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <AverageperCourseChart data={averageperCourseData} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
