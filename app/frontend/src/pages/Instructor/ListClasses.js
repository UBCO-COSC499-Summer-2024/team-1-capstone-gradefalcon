import React, { useState, useEffect } from "react";
import "../../css/style.css";

const ListClasses = () => {
  const [classes, setClasses] = useState([]); // Change to use an array

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("/api/classes", {
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
          console.error("Failed to fetch classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <>
      <ul>
        {classes.map((classItem) => (
          <div className="class-card" key={classItem.course_id}>
            <h4>
              <a href={`/classManagement/${classItem.class_id}`}>
                {classItem.course_id}
              </a>
            </h4>
            <p>Details about Class 1</p>
          </div>
        ))}
      </ul>
    </>
  );
};

export default ListClasses;
