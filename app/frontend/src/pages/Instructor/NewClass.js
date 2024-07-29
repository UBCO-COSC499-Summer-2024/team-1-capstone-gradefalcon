import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
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
  const fileInputRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);

      Papa.parse(selectedFile, {
        delimiter: ",",
        skipEmptyLines: true,
        complete: (results) => {
          console.log("File change results:", results);

          if (results.errors.length > 0) {
            const errorMessages = results.errors.map(e => e.message).join(", ");
            console.error("CSV Parsing errors:", results.errors);
            alert(`Error parsing CSV file. Please ensure the file is formatted correctly. Errors: ${errorMessages}`);
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
          console.log("Parsed columns:", columns);

          if (columns.length !== 3 || columns[0] !== 'student name' || columns[1] !== 'student id' || columns[2] !== 'student email') {
            alert("CSV file should contain exactly three columns: Student Name, Student ID, and Student Email.");
            fileInputRef.current.value = "";
            return;
          }

          parsedData.shift(); 

          const invalidRows = parsedData.map((row, index) => {
            const studentName = row[0] ? row[0].trim() : "";
            const studentId = row[1] ? row[1].trim() : "";
            const studentEmail = row[2] ? row[2].trim() : "";
            if (
              row.length !== 3 ||
              studentName === "" ||
              isNaN(studentId) ||
              studentId.length < 1 ||
              studentId.length > 12 ||
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(studentEmail)
            ) {
              return `Row ${index + 2}: [${row.join(", ")}] is invalid.`;
            }
            return null;
          }).filter(row => row !== null);

          if (invalidRows.length > 0) {
            console.error("Invalid rows found:", invalidRows);
            alert(`CSV file contains invalid data. Please ensure Student ID is a number with length between 1 and 12, Student Name is a non-empty string, and Student Email is a valid email address.\n\n${invalidRows.join("\n")}`);
            fileInputRef.current.value = "";
            return;
          }

          setCol(columns);
          setVal(parsedData);
        },
        header: false,
        error: (error) => {
          console.error("Error parsing CSV file:", error);
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
    console.log("File:", file);
    console.log("Course Name:", courseName);
    console.log("Course ID:", courseId);

    if (file && courseName && courseId) {
      const validStudents = val.every(
        (row) => row.length > 2 && row[0] && row[1] && row[2]
      );
      if (!validStudents) {
        alert("CSV file contains invalid student data. Please ensure all rows have Student Name, Student ID, and Student Email.");
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/import-class", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseName,
            courseId,
            students: val.map((row) => ({
              studentID: row[1],
              studentName: row[0],
              studentEmail: row[2],
            })),
          }),
        });
        console.log("Fetch response:", response);

        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          setToast({ message: "Class successfully added!", type: "success" });
          setTimeout(() => {
            navigate("/classes");
          }, 2000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error uploading the class.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while uploading the file. Please try again.");
      }
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
              Import a CSV file containing the student names, student IDs, and student emails in your class.
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
