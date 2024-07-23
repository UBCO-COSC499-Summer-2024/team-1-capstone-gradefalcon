import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../../css/App.css";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { ToastProvider, ToastViewport } from "../../components/ui/toast";

const NewClassForm = ({ setIsDialogOpen }) => {
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);

      Papa.parse(selectedFile, {
        delimiter: ",",
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            const errorMessages = results.errors.map(e => e.message).join(", ");
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

          if (columns.length !== 2 || columns[0] !== 'student name' || columns[1] !== 'student id') {
            alert("CSV file should contain exactly two columns: Student Name and Student ID.");
            fileInputRef.current.value = "";
            return;
          }

          parsedData.shift();

          const invalidRows = parsedData.map((row, index) => {
            const studentName = row[0] ? row[0].trim() : "";
            const studentId = row[1] ? row[1].trim() : "";
            if (
              row.length !== 2 ||
              studentName === "" ||
              isNaN(studentId) ||
              studentId.length < 1 ||
              studentId.length > 12
            ) {
              return `Row ${index + 2}: [${row.join(", ")}] is invalid.`;
            }
            return null;
          }).filter(row => row !== null);

          if (invalidRows.length > 0) {
            alert(`CSV file contains invalid data. Please ensure Student ID is a number with length between 1 and 12, and Student Name is a non-empty string.\n\n${invalidRows.join("\n")}`);
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

  const handleFileUpload = () => {
    if (file && courseName && courseId) {
      const validStudents = val.every(
        (row) => row.length > 1 && row[0] && row[1]
      );
      if (!validStudents) {
        alert("CSV file contains invalid student data. Please ensure all rows have studentID and studentName.");
        return;
      }

      fetch("/api/class/import-class", {
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
          toast({
            title: "Class created successfully",
            description: "The class has been created successfully.",
            variant: "default"
          });
          setTimeout(() => {
            navigate("/classes");
            setIsDialogOpen(false);
          }, 2000);
        })
        .catch((error) => {
          toast({
            title: "An error occurred",
            description: "An error occurred while uploading the file. Please try again.",
            variant: "destructive"
          });
        });
    } else {
      alert("Please provide a course name, course ID, and a CSV file:");
    }
  };

  return (
    <ToastProvider>
      <form>
        <div className="mb-4">
          <label htmlFor="course-name" className="block text-sm font-medium text-gray-700">Course Name:</label>
          <Input
            type="text"
            id="course-name"
            data-testid="courseName"
            className="input-field mt-1 block w-full"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="course-id" className="block text-sm font-medium text-gray-700">Course ID:</label>
          <Input
            type="text"
            id="course-id"
            data-testid="courseId"
            className="input-field mt-1 block w-full"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>
        <p className="mb-4">Import a CSV file containing the student names and their student IDs in your class.</p>
        <div className="file-input-container">
          <label className="file-input-button">
            Choose File
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              data-testid="csvFile"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <span className="file-input-label">no file selected</span>
        </div>
        <div className="flex gap-4 mt-4">
          <Button size="sm" className="dialog-button" onClick={handleFileUpload}>
            <span>Import</span>
          </Button>
        </div>
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr>
              {col.length > 0 && col.map((col, i) => <th key={i} className="border-b py-2 text-left">{col}</th>)}
            </tr>
          </thead>
          <tbody data-testid="tableBody">
            {val.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border-b py-2">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <ToastViewport />
    </ToastProvider>
  );
};

export default NewClassForm;
