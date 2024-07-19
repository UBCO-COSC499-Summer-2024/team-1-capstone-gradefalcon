import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/App.css";

const ReviewExams = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('/api/exam/fetchImage');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchImage();
  }, []);

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
