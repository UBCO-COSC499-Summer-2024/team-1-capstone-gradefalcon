<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Class Management</title>
    <link rel="stylesheet" href="../style.css">
    <style>
.class-management {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.new-exam-btn {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    margin-bottom: 20px;
}

.new-exam-btn:hover {
    background-color: #45a049;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

thead th {
    padding: 10px;
    background-color: #f2f2f2;
    border-bottom: 1px solid #ddd;
}

tbody td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: center;
}

.export-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
}

.export-btn:hover {
    background-color: #45a049;
}

.grade-cell {
            color: white;
            padding: 10px;
            text-align: center;
        }

.grade-85 { background-color: #4caf50; } /* 85% */
.grade-89 { background-color: #3e8e41; } /* 89% */
.grade-75 { background-color: #66bb6a; } /* 75% */
.grade-67 { background-color: #a5d6a7; } /* 67% */ /*will integrate with backend later*/
.grade-55 { background-color: #ff7043; } /* 55% */
.grade-34 { background-color: #ff5252; } /* 34% */
    </style>
</head>
<body>
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
                        <td class="grade-cell grade-89">89%</td>
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
</body>
</html>