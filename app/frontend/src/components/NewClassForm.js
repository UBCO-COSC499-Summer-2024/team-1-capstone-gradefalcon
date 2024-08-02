import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import "../css/App.css";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import { Label } from "../components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0

const NewClassForm = ({ setIsDialogOpen }) => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
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
            alert(`CSV file contains invalid data. Please ensure Student ID is a number with length between 1 and 12, Student Name is a non-empty string, and Student Email is a valid email address.\n\n${invalidRows.join("\n")}`);
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
    if (file && courseName && courseId) {
      const validStudents = val.every(
        (row) => row.length > 2 && row[0] && row[1] && row[2]
      );
      if (!validStudents) {
        alert("CSV file contains invalid student data. Please ensure all rows have Student Name, Student ID, and Student Email.");
        return;
      }

      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch("/api/class/import-class", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Include the token in the request
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

        if (response.ok) {
          const data = await response.json();
          toast({
            title: "Class created successfully",
            description: "The class has been created successfully.",
            variant: "default"
          });
          setTimeout(() => {
            navigate("/classes");
            setIsDialogOpen(false);
          }, 2000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error uploading the class.");
        }
      } catch (error) {
        toast({
          title: "An error occurred",
          description: "An error occurred while uploading the file. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      alert("Please provide a course name, course ID, and a CSV file.");
    }
  };

  return (
    <ToastProvider>
    <form>
      <Card className="p-3">
        <CardHeader>
          <CardTitle className="text-lg">Create New Class</CardTitle>
          <CardDescription className="text-sm">
            Enter the details for the new class and upload the student list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <Label htmlFor="course-name" className="block text-sm font-medium text-gray-700">
              Course Name:
            </Label>
            <Input
              type="text"
              id="course-name"
              data-testid="courseName"
              className="input-field mt-1 block w-full"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="course-id" className="block text-sm font-medium text-gray-700">
              Course ID:
            </Label>
            <Input
              type="text"
              id="course-id"
              data-testid="courseId"
              className="input-field mt-1 block w-full"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </div>
          <p className="mb-3 text-sm">Import a CSV file containing the student names, their student IDs, and student emails in your class.</p>
          <div className="file-input-container mb-3">
            <label className="file-input-button text-sm cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
            <span className="file-input-label text-sm">no file selected</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleFileUpload} data-testid="uploadButton">
              <span>Import</span>
            </Button>
          </div>
          {col.length > 0 && (
            <Table className="mt-3 w-full border-collapse text-sm">
              <TableHead>
                <TableRow>
                  {col.map((col, i) => (
                    <TableCell key={i} className="border-b py-2 text-left">
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody data-testid="TableBody">
                {val.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="border-b py-2">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <ToastViewport />
    </form>
  </ToastProvider>
  );
};

export default NewClassForm;
