import React, { useState, useEffect } from "react";
import { useLogto } from '@logto/react';
import "../css/App.css";

const ListClasses = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const { isAuthenticated, getAccessToken } = useLogto();

  useEffect(() => {
    const fetchClasses = async () => {
      if (isAuthenticated) {
        const accessToken = await getAccessToken('http://localhost:3000/api/class/classes');
        try {
          const response = await fetch("http://localhost:3000/api/class/classes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setClasses(data);
          } else {
            setError("Failed to fetch classes");
          }
        } catch (error) {
          setError("Error fetching classes: " + error.message);
        }
      }
    };

    fetchClasses();
  }, [isAuthenticated, getAccessToken]);

  if (error) {
    return <div data-testid="list-classes-error">{error}</div>;
  }

  if (classes.length === 0) {
    return <div data-testid="list-classes">No classes available</div>;
  }


  return (
    <ul>
      {classes.map((classItem) => (
        <div className="class-card" key={classItem.course_id}>
          <h4>
            <a href={`/classManagement/${classItem.class_id}`}>
              {classItem.course_id}
            </a>
          </h4>
          <p>{classItem.course_name}</p>
        </div>
      ))}
    </ul>
  );
};

export default ListClasses;