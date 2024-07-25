import "../../css/App.css";
import React, { useEffect, useState } from "react";
import AverageperExamChart from "../../components/AverageperExamChart";
import AverageperCourseChart from "../../components/AverageperCourseChart"; // Updated import

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [standardAverageData, setStandardAverageData] = useState([]);
  const [averageCourseData, setAverageCourseData] = useState([]); // Renamed state

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

    const fetchStandardAverageData = async () => {
      try {
        const response = await fetch("/api/exam/average-per-exam", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
        console.error("Error fetching standard average data:", error);
      }
    };

    const fetchAverageCourseData = async () => { // Updated function
      try {
        const response = await fetch("/api/exam/average-per-course", { // Updated endpoint
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Average Course Data:", data); // Log for debugging
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
    fetchAverageCourseData(); // Updated function call
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
              <h4>Average Score per Exam</h4>
              <AverageperExamChart data={standardAverageData} />
            </div>
            <div className="chart">
              <h4>Average Score per Course</h4>
              <AverageperCourseChart data={averageCourseData} /> {/* Updated component */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

