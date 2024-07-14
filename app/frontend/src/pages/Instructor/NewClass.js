import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../../css/App.css";
import "../../css/NewClass.css";
import Toast from "../../components/Toast";
import { useLogto } from '@logto/react';

const NewClass = () => {
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const { isAuthenticated, getAccessToken } = useLogto();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      Papa.parse(selectedFile, {
        delimiter: ",",
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            alert(`Error parsing CSV file. Please ensure the file is formatted correctly.`);
            fileInputRef.current.value = "";
            return;
          }
          let parsedData = results.data;
          if (parsedData.length === 0) {
            alert("CSV file is empty or improperly formatted.");
            fileInputRef.current.value = "";
            return;
          }
          const columns = parsedData[0].map(header => header.trim().toLowerCase());
          if (columns.length !== 2 || columns[0] !== 'student name' || columns[1] !== 'student id') {
            alert("CSV file should contain exactly two columns: Student Name and Student ID.");
            fileInputRef.current.value = "";
            return;
          }
          parsedData.shift();
          const invalidRows = parsedData.map((row, index) => {
            const studentName = row[0] ? row[0].trim() : "";
            const studentId = row[1] ? row[1].trim() : "";
            if (row.length !== 2 || studentName === "" || isNaN(studentId) || studentId.length < 1 || studentId.length > 12) {
              return `Row ${index + 2}: [${row.join(", ")}] is invalid.`;
            }
            return null;
          }).filter(row => row !== null);
          if (invalidRows.length > 0) {
            alert(`CSV file contains invalid data. Please ensure Student ID is a number with length between 1 and 12, and Student Name is a non-empty string.`);
            fileInputRef.current.value = "";
            return;
          }
          setCol(columns);
          setVal(parsedData);
        },
        header: false,
        error: (error) => {
          alert(`Error parsing CSV file. Please ensure the file is formatted correctly. Error: ${error.message}`);
          fileInputRef.current.value = "";
        },
      });
    } else {
      alert("Please upload a valid CSV file.");
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async () => {
    if (file && courseName && courseId && isAuthenticated) {
      const accessToken = await getAccessToken('http://localhost:3000/api/class/import-class');
      const validStudents = val.every((row) => row.length > 1 && row[0] && row[1]);
      if (!validStudents) {
        alert("CSV file contains invalid student data. Please ensure all rows have studentID and studentName.");
        return;
      }
      fetch("http://localhost:3000/api/class/import-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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
        setToast({ message: "Class successfully added!", type: "success" });
        setTimeout(() => {
          navigate("/classes");
        }, 2000);
      })
      .catch((error) => {
        alert("An error occurred while uploading the file. Please try again.");
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
              data-testid="courseName"
              className="input-field"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <label htmlFor="course-id">Course ID:</label>
            <input
              type="text"
              id="course-id"
              data-testid="courseId"
              className="input-field"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
            <p>
              Import a CSV file containing the student names and their student
              IDs in your class.
            </p>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              data-testid="csvFile"
              onChange={handleFileChange}
            />
            <button
              className="import-btn"
              data-testid="uploadButton"
              onClick={handleFileUpload}
            >
              Import
            </button>
            <table>
              <thead>
                <tr>
                  {col.length > 0 &&
                    col.map((col, i) => <th key={i}>{col}</th>)}
                </tr>
              </thead>
              <tbody data-testid="tableBody">
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
