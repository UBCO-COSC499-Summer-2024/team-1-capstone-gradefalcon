import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/App.css";
import "../../css/ClassManagement.css";

// We need the following data:
// - Student Name
// - Student ID
// - ExamID

const ClassManagement = () => {
  const params = useParams();
  //   let classData = null;
  const [classData, setClassData] = useState({ courseDetails: {} });

  // Fetch class data from the backend
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(
          `/api/classManagement/${params.class_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setClassData(data); // Set the class data state with the fetched data
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, []);

  // Calculate the maximum number of exams taken by a student
  const maxExams = classData.studentInfo
    ? classData.studentInfo.reduce(
        (max, student) => Math.max(max, student.exams.length),
        0
      )
    : 0;

  const courseDetails = classData.courseDetails;

  // Display the class data
  // useEffect(() => {
  //   console.log("classData: ", [classData[0]]);
  //   console.log("courseDetails: ", courseDetails);
  // }, [classData, courseDetails]);

  const exportToCSV = () => {
    // Define CSV headers
    let csvContent = "";
    csvContent +=
      "Student ID,Student Name," +
      [...Array(maxExams).keys()].map((i) => `Exam ${i + 1}`).join(",") +
      "\r\n";

    // Add rows for each student
    classData.studentInfo.forEach((student) => {
      let row = [
        student.student_id,
        student.name,
        ...student.exams.map((exam) => exam.grade),
      ];
      // Fill in empty cells if a student has fewer exams than the max
      for (let i = student.exams.length; i < maxExams; i++) {
        row.push("-");
      }
      csvContent += row.join(",") + "\r\n";
    });

    // Create a Blob from the CSV String
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);

    // Create a link and trigger the download
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${courseDetails[0].course_id}_results.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div class="main-content">
        <header>
          <h2>
            {/* Display the course ID and course name */}
            {courseDetails[0] ? courseDetails[0].course_id : "loading..."}
          </h2>
          <h2>
            {courseDetails[0] ? courseDetails[0].course_name : "loading..."}
          </h2>
        </header>
        <section class="class-management">
          <a href="/NewExam" class="new-exam-btn">
            + New Exam
          </a>
          <h3>Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                {[...Array(maxExams).keys()].map((_, index) => (
                  <th key={index}>Exam {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classData.studentInfo &&
                classData.studentInfo.map((student) => (
                  <tr>
                    <td>{student.student_id}</td>
                    <td>{student.name}</td>
                    {student.exams.map((exam, index) => (
                      <td key={index}>{exam.grade}</td>
                    ))}
                    {/* Fill in empty cells if a student has fewer exams than the max */}
                    {[...Array(maxExams - student.exams.length).keys()].map(
                      (_, index) => (
                        <td key={index}>-</td>
                      )
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          <button className="export-btn" onClick={exportToCSV}>
            Export
          </button>
          <p>Export student grades into a csv file.</p>
        </section>
      </div>
    </>
  );
};
export default ClassManagement;
