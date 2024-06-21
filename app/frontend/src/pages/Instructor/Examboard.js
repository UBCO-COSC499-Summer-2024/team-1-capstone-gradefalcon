import React from 'react';
import '../../css/App.css';
import '../../css/ExamBoard.css';

const ExamBoard = () => {
  return (
    <div className="App">
    <div class="main-content">
        <header>
            <h2>Exam Board</h2>
        </header>
        <section class="exam-list">
            <h3>Graphic Fundamentals:</h3>
            <p>Graphic Fundamentals Final Exam #Q: 80 31-12-2024 13:00-16:00 Saved</p>
            <a href="./NewExam" class="create-new-btn">Create New</a>
            <h3>Advanced Web Design:</h3>
            <p>Advanced Web Design Midterm #1 #Q: 30 10-10-2024 11:30 - 13:00 Graded</p>
            <p>Advanced Web Design Final Exam #Q: 80 30-12-2024 8:00 - 10:00 Published</p>
            <a href="./NewExam" class="create-new-btn">Create New</a>
            <h3>3D Animation Techniques:</h3>
            <a href="./NewExam" class="create-new-btn">Create New</a>
            <h3>User Experience Research:</h3>
            <p>User Experience Research Midterm #1 #Q: 25 01-05-2024 8:00 - 9:00 Graded</p>
            <p>UER In-Class Quiz #1 #Q: 10 12-05-2024 8:00 - 8:15 Graded</p>
            <p>User Experience Research Midterm #2 #Q: 30 01-06-2024 8:00 - 9:00 Saved</p>
            <a href="./NewExam" class="create-new-btn">Create New</a>
        </section>
    </div>
    </div>
    );
};

export default ExamBoard;