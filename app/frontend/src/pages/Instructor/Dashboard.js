import "../../css/App.css";
import React, { useEffect, useState } from "react";
import StandardAverageChart from "../../components/StandardAverageChart";
import PerformanceBarChart from "../../components/PerformanceBarChart";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const roles = user[`${process.env.REACT_APP_AUTH0_AUDIENCE}/roles`] || [];

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
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/session-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include", // This ensures cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("Session Info Data:", data);
          setUserName(data.userName);
        } else {
          console.error("Failed to fetch session info");
          // console.log("Authenticated:", isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching session info:", error);
        // console.log("Authenticated:", isAuthenticated);
      }
    };

    const fetchCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("Courses Data:", data);
          setCourses(data);
        } else {
          console.error("Failed to fetch courses");
          // console.log("Authenticated:", isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        // console.log("Authenticated:", isAuthenticated);
      }
    };

    const fetchExams = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/ExamBoard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("Exams Data:", data);
          setExams(data.classes);
        } else {
          console.error("Failed to fetch exams");
          // console.log("Authenticated:", isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
        // console.log("Authenticated:", isAuthenticated);
      }
    };

    const fetchStandardAverageData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/standard-average-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("Standard Average Data:", data);
          setStandardAverageData(data);
        } else {
          console.error("Failed to fetch standard average data");
          // console.log("Authenticated:", isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching standard average data:", error);
        // console.log("Authenticated:", isAuthenticated);
      }
    };

    const fetchPerformanceData = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/exam/performance-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // console.log("Performance Data:", data);
          setPerformanceData(data);
        } else {
          console.error("Failed to fetch performance data");
          // console.log("Authenticated:", isAuthenticated);
        }
      } catch (error) {
        console.error("Error fetching performance data:", error);
        // console.log("Authenticated:", isAuthenticated);
      }
    };

    fetchSessionInfo();
    fetchCourses();
    fetchExams();
    fetchStandardAverageData();
    fetchPerformanceData();
  }, [getAccessTokenSilently, isAuthenticated]);

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
          <div className="charts-container">
            <div className="chart">
              <h4>Standard Average Chart</h4>
              <StandardAverageChart data={standardAverageData} />
            </div>
            <div className="chart">
              <h4>Performance Bar Chart</h4>
              <PerformanceBarChart data={performanceData} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
