// DarkModeToggle.js

import React, { useState, useEffect } from 'react';
import '../css/DarkModeToggle.css';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="dark-mode-toggle">
      <button className={`toggle-button ${darkMode ? 'dark' : ''}`} onClick={toggleDarkMode}>
        {darkMode ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
};

export default DarkModeToggle;
