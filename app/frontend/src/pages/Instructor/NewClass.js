import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "../../css/App.css";
import Toast from "../../components/Toast";
import {
  Home,
  ClipboardCheck,
  Users,
  LineChart,
  Settings,
  BookOpen
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from "../../components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";

const NewClass = () => {
  const { logout } = useAuth0();
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
      const handleLogout = async () => {
        try {
          // Perform the Auth0 logout
          logout({ logoutParams: { returnTo: window.location.origin } });
    
          // Optionally navigate to a different page after logout
          navigate("/");
        } catch (error) {
          console.error("Error:", error);
        }
      };
  return (
    <div className="flex min-h-screen">
      <aside className="sidebar">
        <div className="logo">
          <ClipboardCheck className="h-6 w-6" />
          <span className="ml-2">GradeFalcon</span>
        </div>
        <nav className="flex flex-col gap-4">
          <Link to="/Dashboard" className="nav-item" data-tooltip="Dashboard">
            <Home className="icon" />
            <span>Dashboard</span>
          </Link>
          <Link to="/Examboard" className="nav-item" data-tooltip="Exam Board">
            <BookOpen className="icon" />
            <span>Exam Board</span>
          </Link>
          <Link to="/Classes" className="nav-item" data-tooltip="Classes">
            <Users className="icon" />
            <span>Classes</span>
          </Link>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="nav-item" data-tooltip="My Account">
                <Settings className="icon" />
                <span>My Account</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/AccountSettings">Account Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/NotificationPreferences">Notification Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild onClick={handleLogout}>
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      <div className="main-content flex-1 p-8 bg-gradient-to-r from-gradient-start to-gradient-end">
        <main className="flex flex-col gap-4">
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-4">Create New Class</h1>
            <div className="grid gap-4 lg:grid-cols-1">
              <Card className="bg-white border rounded">
                <CardHeader className="flex justify-between px-6 py-4">
                  <div>
                    <CardTitle className="mb-2">New Class Details</CardTitle>
                    <CardDescription>Enter the details for the new class and import the student list via a CSV file.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="mb-4">
                      <label htmlFor="course-name" className="block text-sm font-medium text-gray-700">Course Name:</label>
                      <input
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
                      <input
                        type="text"
                        id="course-id"
                        data-testid="courseId"
                        className="input-field mt-1 block w-full"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                      />
                    </div>
                    <p className="mb-4">Import a CSV file containing the student names and their student IDs in your class.</p>
                    <input
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      data-testid="csvFile"
                      className="input-field mt-1 block w-full"
                      onChange={handleFileChange}
                    />
                    <div className="flex gap-4 mt-4">
                      <Button size="sm" onClick={handleFileUpload} data-testid="uploadButton">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
  }
};
export default NewClass;
