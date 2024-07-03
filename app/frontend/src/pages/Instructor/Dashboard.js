import "../../css/App.css";
import React, { useEffect, useState } from "react";
import StandardAverageChart from "../../components/StandardAverageChart";
import PerformanceBarChart from "../../components/PerformanceBarChart";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);

  const colors = ["#E9D8FD", "#FEEBC8", "#BEE3F8", "#C6F6D5"];
  let colorIndex = 0;

  const getNextColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color;
  };

  useEffect(() => {
    // Fetch session information to get the username
    const fetchSessionInfo = async () => {
      try {
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

    // Fetch data for the standard average chart
    const fetchStandardAverageData = async () => {
      try {
        const response = await fetch("/api/standard-average-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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

    // Fetch data for the performance bar chart
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch("/api/performance-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setPerformanceData(data);
        } else {
          console.error("Failed to fetch performance data");
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    // Fetch the list of courses the user is enrolled in
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/class/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

    // Fetch the list of exams
    const fetchExams = async () => {
      try {
        const response = await fetch("/api/exam/ExamBoard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

    fetchSessionInfo();
    fetchStandardAverageData();
    fetchPerformanceData();
    fetchCourses();
    fetchExams();
  }, []);

  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Welcome, {userName ? userName : "Guest"}!</h2>
        </header>
        <section className="courses">
          <h3>Enrolled Courses</h3>
          {courses.map((course, index) => (
            <div className="course-card" key={index} style={{ backgroundColor: getNextColor() }}>
              <h4>{course.course_name} - {course.course_id}</h4>
              {/* Additional course details can be added here if available */}
            </div>
          ))}
        </section>
        <section className="exam-board">
          <h3>Exam Board</h3>
          <table>
            <thead>
              <tr>
                <th>Exam Name</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam, index) => (
                <tr key={index}>
                  <td>{exam.exam_title}</td>
                  <td>{exam.course_id}</td>
                  <td className="status completed">Completed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="charts">
          <h3>Performance Charts</h3>
          <div className="chart">
            <h4>Standard Average Chart</h4>
            <StandardAverageChart data={standardAverageData} />
          </div>
          <div className="chart">
            <h4>Performance Bar Chart</h4>
            <PerformanceBarChart data={performanceData} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
