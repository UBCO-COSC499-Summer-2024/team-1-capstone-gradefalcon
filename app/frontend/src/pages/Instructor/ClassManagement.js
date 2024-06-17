import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/style.css";

// We need the following data:
// - Student Name
// - Student ID
// - ExamID

const ClassManagement = () => {
  const params = useParams();
  //   let classData = null;
  const [classData, setClassData] = useState([]); // Change to use an object

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

  const maxExams = classData.reduce(
    (max, student) => Math.max(max, student.exams.length),
    0
  );

  // Display the class data
  // useEffect(() => {
  //   console.log("classData: ", [classData[0]]); // []
  // }, [classData]);

  return (
    <>
      <style>
        {`
.class-management {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    height: 100vh;
}

.new-exam-btn {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    margin-bottom: 20px;
}

.new-exam-btn:hover {
    background-color: #45a049;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

thead th {
    padding: 10px;
    background-color: #4CAF50;
    border-bottom: 1px solid #ddd;
}

tbody td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: center;
}

.export-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
}

.export-btn:hover {
    background-color: #45a049;
}

.grade-cell {
            color: white;
            padding: 10px;
            text-align: center;
        }

.grade-85 { background-color: #4caf50; } /* 85% */
.grade-89 { background-color: #3e8e41; } /* 89% */
.grade-75 { background-color: #66bb6a; } /* 75% */
.grade-67 { background-color: #a5d6a7; } /* 67% */ /*will integrate with backend later*/
.grade-55 { background-color: #ff7043; } /* 55% */
.grade-34 { background-color: #ff5252; } /* 34% */
`}
      </style>
      <div class="main-content">
        <header>
          <h2>Advanced Web Design</h2>
          <h2>{params.class_id}</h2>
        </header>
        <section class="class-management">
          <a href="NewExam.html" class="new-exam-btn">
            + New Exam
          </a>
          <h3>Grades</h3>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                {[...Array(maxExams).keys()].map((_, index) => (
                  <th key={index}>Exam {index + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classData.map((student) => (
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
          <button class="export-btn">Export</button>
          <p>Export student grades into a csv file.</p>
        </section>
      </div>
    </>
  );
};
export default ClassManagement;
