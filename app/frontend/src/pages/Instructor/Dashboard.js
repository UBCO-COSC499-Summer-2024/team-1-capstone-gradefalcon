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
import { Badge } from "../../components/ui/badge";
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
        console.error("Error fetching standard average data");
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
        alert("Logged out");
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
      <aside className="sidebar">
        <div className="logo">
          <ClipboardCheck className="h-6 w-6" />
          <span className="ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
            <Home className="icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
            <BookOpen className="icon" />
            <span>Exam Board</span>
          </Link>
          <Link to="/Classes" className="nav-item" data-tooltip="Classes">
            <Users className="icon" />
            <span>Classes</span>
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="nav-item" data-tooltip="My Account">
                <Settings className="icon" />
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
              <DropdownMenuItem asChild onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">Your Courses</CardTitle>
                    <CardDescription>Your enrolled courses.</CardDescription>
                  </div>
                  <Button asChild size="sm" className="ml-auto gap-1">
                    <Link to="/ClassManagement">
                      Manage Courses
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="bg-white border rounded">
              <CardHeader className="flex justify-between px-6 py-4">
                <div>
                  <CardTitle className="mb-2">Exam Board</CardTitle>
                  <CardDescription>Recent exams from your classes.</CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link to="/Examboard">
                    Manage Exams
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Course</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
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
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs secondary">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-white border rounded">
                <CardHeader>
                  <CardTitle>Standard Average Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <StandardAverageChart data={standardAverageData} className="w-full" />
                </CardContent>
              </Card>
              <Card className="bg-white border rounded">
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








