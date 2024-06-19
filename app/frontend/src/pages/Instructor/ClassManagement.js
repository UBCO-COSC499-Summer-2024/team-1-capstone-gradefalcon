import React from 'react';
import '../../css/style.css';
import '../../css/ClassManagement.css';

const ClassManagement = () => {
  return (
    <div class="main-content">
        <header>
            <h2>Advanced Web Design</h2>
        </header>
        <section class="class-management">
            <a href="NewExam.html" class="new-exam-btn">+ New Exam</a>
            <h3>Grades</h3>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Midterm 1</th>
                        <th>Midterm 2</th>
                        <th>Final</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>John Doe</td>
                        <td>19345113</td>
                        <td class="grade-cell grade-85">85%</td>
                        <td class="grade-cell grade-89">89%</td>   {/* Will become functions of the backend v */}
                        <td class="grade-cell grade-75">75%</td>
                    </tr>
                    <tr>
                        <td>Jane Doe</td>
                        <td>12345678</td>
                        <td class="grade-cell grade-75">75%</td>
                        <td class="grade-cell grade-67">67%</td>
                        <td class="grade-cell grade-78">78%</td>
                    </tr>
                    <tr>
                        <td>Anthony Smith</td>
                        <td>54326768</td>
                        <td class="grade-cell grade-55">55%</td>
                        <td class="grade-cell grade-34">34%</td>
                        <td class="grade-cell grade-75">75%</td>
                    </tr>
                </tbody>
            </table>
            <button class="export-btn">Export</button>
            <p>Export student grades into a csv file.</p>
        </section>
    </div>
);
};
export default ClassManagement;
