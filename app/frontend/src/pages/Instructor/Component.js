import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Bookmark,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import StandardAverageChart from "../../components/StandardAverageChart";
import PerformanceBarChart from "../../components/PerformanceBarChart";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";

export default function Component() {
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const navigate = useNavigate();

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
        const response = await fetch("/api/exam/standard-average-data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
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

    const fetchPerformanceData = async () => {
      try {
        const response = await fetch("/api/exam/performance-data", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setPerformanceData(data);
        } else {
          console.error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Error fetching performance data");
      }
    };

    fetchSessionInfo();
    fetchCourses();
    fetchExams();
    fetchStandardAverageData();
    fetchPerformanceData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col p-4 fixed h-full">
        <div className="flex items-center mb-8">
          <ClipboardCheck className="h-6 w-6" />
          <span className="text-lg font-semibold ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary p-2 rounded flex items-center">
            <Home className="mr-2" /> Dashboard
          </Link>
          <Link to="/Examboard" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary p-2 rounded flex items-center">
            <BookOpen className="mr-2" /> Exam Board
          </Link>
          <Link to="/GradeReport" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary p-2 rounded flex items-center">
            <LineChart className="mr-2" /> Grade Report
          </Link>
          <Link to="/Classes" className="text-primary-foreground hover:bg-primary-foreground hover:text-primary p-2 rounded flex items-center">
            <Users className="mr-2" /> Classes
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-6 w-6" />
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem asChild>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to logout?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>OK</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="flex-1 ml-64 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">👋 Welcome {userName} </h1>
            <h2 className="text-lg font-semibold md:text-2xl"><BookOpen className="inline mr-2" /> Your Courses</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {courses.map((course, index) => (
                <Card key={index} className="p-4 border rounded-lg -md flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-lg font-semibold">{course.course_name}</CardTitle>
                    <Bookmark className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold">{course.course_id}</div>
                    <Button className="mt-4">Create New Exam</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="bg-white border rounded ">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle className="uppercase">Exam Board</CardTitle>
                  <CardDescription>Recent exams from your classes.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link to="#">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table className="bg-white border rounded ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black text-center"><span>Exam Name <ChevronDown className="inline-block" /></span></TableHead>
                      <TableHead className="text-black text-center"><span>Course <ChevronDown className="inline-block" /></span></TableHead>
                      <TableHead className="text-black text-center"><span>Status <ChevronDown className="inline-block" /></span></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.map((exam, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-center">{exam.exam_title}</TableCell>
                        <TableCell className="text-center">{exam.course_id}</TableCell>
                        <TableCell className="text-center status">
                          <CheckCircle className="inline-block text-green-500 mr-1" />
                          Completed
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white border rounded ">
                <CardHeader>
                  <CardTitle>Standard Average Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <StandardAverageChart data={standardAverageData} className="w-full" />
                </CardContent>
              </Card>
              <Card className="bg-white border rounded ">
                <CardHeader>
                  <CardTitle>Performance Bar Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceBarChart data={performanceData} className="w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}




