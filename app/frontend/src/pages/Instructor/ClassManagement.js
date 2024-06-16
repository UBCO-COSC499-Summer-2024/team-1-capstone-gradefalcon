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
          `/api/classManagement/${params.course_id}`,
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
          setClassData(data); // Set the classData state with the fetched data
        } else {
          console.error("Failed to fetch class data");
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };

    fetchClassData();
  }, [params.course_id]);

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
    background-color: #f2f2f2;
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
          <h2>No. of students: {classData[0].student_id}</h2>
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
                <th>Midterm 1</th>
                <th>Midterm 2</th>
                <th>Final</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>19345113</td>
                <td class="grade-cell grade-85">85%</td>
                <td class="grade-cell grade-89">89%</td>{" "}
                {/* Will become functions of the backend v */}
                <td class="grade-cell grade-75">75%</td>
              </tr>
              <tr>
                <td>Jane Doe</td>
                <td>12345678</td>
                <td class="grade-cell grade-75">75%</td>
                <td class="grade-cell grade-67">67%</td>
                <td class="grade-cell grade-78">78%</td>
              </tr>
              <tr>
                <td>Anthony Smith</td>
                <td>54326768</td>
                <td class="grade-cell grade-55">55%</td>
                <td class="grade-cell grade-34">34%</td>
                <td class="grade-cell grade-75">75%</td>
              </tr>
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
