import React, { useEffect } from "react";
import "../css/App.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Auto close after 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {message}
      <button onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};

export default Toast;
