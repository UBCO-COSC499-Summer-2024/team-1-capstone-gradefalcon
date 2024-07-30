import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import "../../css/App.css";

const ReviewExams = () => {
  const { getAccessTokenSilently } = useAuth0(); // Get the token
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = await getAccessTokenSilently(); // Get the token
        const response = await fetch('/api/exam/fetchImage', {
          headers: {
            "Authorization": `Bearer ${token}`, // Include the token in the request
          },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchImage();
  }, [getAccessTokenSilently]);

  return (
    <div style={{ textAlign: 'center', margin: '2px 0' }}>
      <h1>Graded Exam</h1>
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt="Student Answers" 
          style={{ 
            maxWidth: '50%', 
            height: 'auto', 
            display: 'block', 
            marginLeft: 'auto' /* Aligns the image to the right */
          }} 
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ReviewExams;
