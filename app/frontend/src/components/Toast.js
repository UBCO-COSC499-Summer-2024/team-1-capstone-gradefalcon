import React, { useEffect } from 'react';
import './css/style.css'; 

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
      <button onClick={onClose} className="close-btn">&times;</button>
    </div>
  );
};

export default Toast;
