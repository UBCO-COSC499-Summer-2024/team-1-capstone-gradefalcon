import "../../css/App.css";
import React, { useEffect, useState } from "react";
import StandardAverageChart from "../../components/StandardAverageChart";
import PerformanceBarChart from "../../components/PerformanceBarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"


const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  const colors = ["#E9D8FD", "#FEEBC8", "#BEE3F8", "#C6F6D5"];
  let colorIndex = 0;

  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

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
        console.error("Error fetching courses:", error);
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
        console.error("Error fetching exams:", error);
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
          console.log("Standard Average Data:", data); // Log the fetched data
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
          console.log("Performance Data:", data); // Log the fetched data
          setPerformanceData(data);
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
    fetchPerformanceData();
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2 className="text-2xl">Welcome, {userName ? userName : "Guest"}!</h2>
        </header>
        <section className="courses">
          <h3 className="text-xl mb-4">Enrolled Courses</h3>
          {courses.map((course, index) => (
            <Card key={index} className="mb-4" style={{ backgroundColor: getNextColor() }}>
              <h4 className="text-lg">{course.course_name} - {course.course_id}</h4>
              {/* Additional course details can be added here if available */}
            </Card>
          ))}
        </section>
        <section className="exam-board">
          <h3 className="text-xl mb-4">Exam Board</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Exam Name</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam, index) => (
                <TableRow key={index}>
                  <TableCell>{exam.exam_title}</TableCell>
                  <TableCell>{exam.course_id}</TableCell>
                  <TableCell className="status completed">Completed</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section className="charts">
          <h3 className="text-xl mb-4">Performance Charts</h3>
          <div className="charts-container flex justify-between gap-4">
            <div className="chart flex-1 bg-white p-4 rounded shadow">
              <h4 className="text-lg mb-2">Standard Average Chart</h4>
              <StandardAverageChart data={standardAverageData} />
            </div>
            <div className="chart flex-1 bg-white p-4 rounded shadow">
              <h4 className="text-lg mb-2">Performance Bar Chart</h4>
              <PerformanceBarChart data={performanceData} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
