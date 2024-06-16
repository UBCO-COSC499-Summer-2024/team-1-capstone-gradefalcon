import React, { useState, useEffect } from "react";
import "../../css/style.css";
import "../../css/Classes.css";
import ListClasses from "./ListClasses";

const Classes = () => {
  return (
    <>
      <body>
        <div className="App">
          <div className="main-content">
            <header>
              <h2>Classes</h2>
            </header>
            <section className="class-list">
              <h3>Your Classes</h3>
              <ListClasses />
            </section>
            <section className="new-class">
              <h3>Create a new class</h3>
              <p>
                Import a CSV file containing the student names and their student
                IDs in your class.
              </p>
              <div className="upload-area">
                <input type="file" id="file-input" hidden />
                <div
                  className="drag-drop-area"
                  onClick={() => document.getElementById("file-input").click()}
                >
                  <p>Click to browse or drag and drop your files</p>
                </div>
                <button className="import-btn">Import</button>
              </div>
            </section>
          </div>
        </div>
      </body>
    </>
  );
};

export default Classes;
