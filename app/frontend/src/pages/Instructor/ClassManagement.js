import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/App.css";
import "../../css/ClassManagement.css";

const ClassManagement = () => {
  const params = useParams();
  const [classData, setClassData] = useState({ courseDetails: {} });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await fetch(
          `/api/class/classManagement/${params.class_id}`,
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
          setClassData(data);
        } else {
          setError("Failed to fetch class data");
        }
      } catch (error) {
        setError("Error fetching class data");
      } finally {
        setLoading(false); // Set loading to false once fetch is complete
      }
    };

    fetchClassData();
  }, [params.class_id]);

  const maxExams = classData.studentInfo
    ? classData.studentInfo.reduce(
        (max, student) => Math.max(max, student.exams.length),
        0
      )
    : 0;

  const courseDetails = classData.courseDetails;

  const exportToCSV = () => {
    let csvContent = "";
    csvContent +=
      "Student ID,Student Name," +
      [...Array(maxExams).keys()].map((i) => `Exam ${i + 1}`).join(",") +
      "\r\n";

    classData.studentInfo.forEach((student) => {
      let row = [
        student.student_id,
        student.name,
        ...student.exams.map((exam) => exam.grade),
      ];
      for (let i = student.exams.length; i < maxExams; i++) {
        row.push("-");
      }
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    if (link.download !== undefined) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="main-content">
      <header>
        <h2>{courseDetails[0] ? courseDetails[0].course_id : "loading..."}</h2>
        <h2>{courseDetails[0] ? courseDetails[0].course_name : "loading..."}</h2>
      </header>
      <section className="class-management">
        <a href={`../NewExam/${params.class_id}`} className="new-exam-btn">
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
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.name}</td>
                  {student.exams.map((exam, index) => (
                    <td key={index}>{exam.grade}</td>
                  ))}
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
  );
};

export default ClassManagement;
