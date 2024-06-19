import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import '../../css/style.css';
import '../../css/NewClass.css';

const NewClass = () => {
  const [col, setCol] = useState([]);
  const [val, setVal] = useState([]);
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [userName, setUserName] = useState('');
  const [instructorId, setInstructorId] = useState(null);

  useEffect(() => {
    const fetchSessionInfo = async () => {
      try {
        const response = await fetch('/api/session-info', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This ensures cookies are included in the request
        });
        if (response.ok) {
          const data = await response.json();
          setUserName(data.userName);
          setInstructorId(data.instructorId); // Assuming the response contains instructorId
        } else {
          console.error('Failed to fetch session info');
        }
      } catch (error) {
        console.error('Error fetching session info:', error);
      }
    };

    fetchSessionInfo();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      Papa.parse(selectedFile, {
        complete: (results) => {
          console.log('File change results:', results); // Debugging log
          let parsedData = results.data.map(row => row[0].split(',')).filter(row => row.length > 1 && row[0] && row[1]);
          const columns = parsedData.shift(); // Remove the header row
          setCol(columns);
          setVal(parsedData);
        },
        header: false,
      });
    }
  };

  const handleFileUpload = () => {
    console.log('File:', file); // Debugging log
    console.log('Course Name:', courseName); // Debugging log
    console.log('Course ID:', courseId); // Debugging log
    console.log('Instructor ID:', instructorId); // Debugging log

    if (file && courseName && courseId && instructorId) {
      // Validate the parsed data
      const validStudents = val.every(row => row.length > 1 && row[0] && row[1]);
      if (!validStudents) {
        alert('CSV file contains invalid student data. Please ensure all rows have studentID and studentName.');
        return;
      }

      // Send the parsed data to the backend
      fetch('/api/import-class', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName,
          courseId,
          instructorId,
          students: val.map(row => ({ studentID: row[1], studentName: row[0] })),
        }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        // Handle success (e.g., show a message or update the UI)
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle error (e.g., show a message)
      });
    } else {
      alert('Please provide a course name, course ID, and a CSV file:');
    }
  };

  return (
    <div className="App">
      <div className="main-content">
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
            <p>Import a CSV file containing the student names and their student IDs in your class.</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
            <button className="import-btn" onClick={handleFileUpload}>Import</button>
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
