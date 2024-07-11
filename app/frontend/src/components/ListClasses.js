import React, { useState, useEffect } from "react";
import "../css/App.css";

const ListClasses = () => {
  const [classes, setClasses] = useState([]); // Change to use an array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/class/classes", {
          // Change to the correct endpoint
          method: "POST", // Ensure method matches your server's endpoint
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data); // Set the classes state with the fetched data
        } else {
          setError("Failed to fetch classes");
        }
      } catch (error) {
        setError("Error fetching classes: " + error.message);
      }
    };

    fetchClasses();
  }, []);

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