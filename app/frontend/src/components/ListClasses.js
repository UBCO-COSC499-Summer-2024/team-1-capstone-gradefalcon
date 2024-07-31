import React, { useState, useEffect } from "react";
import "../css/App.css";
import { useAuth0 } from "@auth0/auth0-react";

const ListClasses = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [classes, setClasses] = useState([]); // Change to use an array
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("/api/class/classes", {
          method: "POST", // Ensure method matches your server's endpoint
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data); // Set the classes state with the fetched data
        } else {
          setError("Failed to fetch classes");
          console.log("Failed to fetch classes:", response.status, response.statusText); // Log error
        }
      } catch (error) {
        setError("Error fetching classes: " + error.message);
        console.error("Error fetching classes:", error); // Log error
      }
    };

    if (isAuthenticated) {
      fetchClasses();
    } else {
      console.log("User is not authenticated");
    }
  }, [getAccessTokenSilently, isAuthenticated]);

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
