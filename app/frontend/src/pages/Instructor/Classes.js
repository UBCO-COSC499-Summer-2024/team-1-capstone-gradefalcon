import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/style.css';
import '../../css/Classes.css';

const Classes = () => {
  return (
    <div className="App">
      <div className="main-content">
        <header>
          <h2>Classes</h2>
        </header>
        <section className="class-list">
          <h3>Your Classes</h3>
          <div className="class-card">
            <h4><a href="ClassManagement.html">Class 1</a></h4>
            <p>Details about Class 1</p>
          </div>
          <div className="class-card">
            <h4><a href="ClassManagement.html">Class 2</a></h4>
            <p>Details about Class 2</p>
          </div>
          {/* Add more class cards as needed */}
        </section>
        <section className="new-class">
          <h3>Create a new class</h3>
          <p>Import a CSV file containing the student names and their student IDs in your class.</p>
          <Link to="/new-class" className="btn">Create Class</Link>
        </section>
      </div>
    </div>
  );
};

export default Classes;