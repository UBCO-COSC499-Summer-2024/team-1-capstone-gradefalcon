import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../../css/App.css";
import "../../css/NewClass.css";
import Toast from "../../components/Toast";

const NewClass = () => {
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (results) => {
          console.log("File change results:", results); // Debugging log
          let parsedData = results.data
            .map((row) => row[0].split(","))
            .filter((row) => row.length > 1 && row[0] && row[1]);
          const columns = parsedData.shift(); // Remove the header row
          setCol(columns);
          setVal(parsedData);
        },
        header: false,
      });
    }
  };

  const handleFileUpload = () => {
    console.log("File:", file); // Debugging log
    console.log("Course Name:", courseName); // Debugging log
    console.log("Course ID:", courseId); // Debugging log

    if (file && courseName && courseId) {
      // Validate the parsed data
      const validStudents = val.every(
        (row) => row.length > 1 && row[0] && row[1]
      );
      if (!validStudents) {
        alert(
          "CSV file contains invalid student data. Please ensure all rows have studentID and studentName."
        );
        return;
      }

      // Send the parsed data to the backend
      fetch("/api/import-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName,
          courseId,
          students: val.map((row) => ({
            studentID: row[1],
            studentName: row[0],
          })),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Handle success (e.g., show a message or update the UI)
          // Show success toast and navigate to classManagement page
          setToast({ message: "Class successfully added!", type: "success" });
          setTimeout(() => {
            navigate("/classes");
          }, 2000); // Delay to allow the toast to be visible for a moment
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error (e.g., show a message)
        });
    } else {
      alert("Please provide a course name, course ID, and a CSV file:");
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <header>
          <h2>Create New Class</h2>
        </header>
        <section className="new-class">
          <div className="new-class-form">
            <label htmlFor="course-name">Course Name:</label>
            <input
              type="text"
              id="course-name"
              className="input-field"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <label htmlFor="course-id">Course ID:</label>
            <input
              type="text"
              id="course-id"
              className="input-field"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
            <p>
              Import a CSV file containing the student names and their student
              IDs in your class.
            </p>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button className="import-btn" onClick={handleFileUpload}>
              Import
            </button>
            <table>
              <thead>
                <tr>
                  {col.length > 0 &&
                    col.map((col, i) => <th key={i}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {val.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default NewClass;
