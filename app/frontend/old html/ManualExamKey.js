<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Manual Answer Key</title>
    <link rel="stylesheet" href="../style.css">
    <style>
.new-exam {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.new-exam h3 {
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 10px;
}

.new-exam p {
    font-size: 14px;
    margin-bottom: 20px;
    color: #555;
}

.input-field {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
}

.schedule-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.schedule-field input {
    width: 23%;
}

.btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.btn:hover {
    background-color: #45a049;
}

form {
    display: flex;
    flex-direction: column;
}

.bubble-grid {
    display: flex;
    flex-direction: column;
}

.question {
    margin: 10px 0;
    display: flex;
    align-items: center;
}

.options {
    margin-left: 10px;
}

.option {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 0 5px;
    border-radius: 50%;
    border: 2px solid #333;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
}

.option.selected {
    background-color: #4CAF50;
    color: white;
}

.nested-window {
    width: 100%;
    height: 400px;
    overflow-y: auto;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    box-sizing: border-box;
    margin-top: 20px;
}

    </style>
    <script>
        function toggleSelection(event) {
            event.target.classList.toggle('selected');
        }

        function updateQuestions() {
            const numQuestions = document.getElementById('num-questions').value;
            const numOptions = document.getElementById('num-options').value;
            const bubbleGrid = document.querySelector('.bubble-grid');

            bubbleGrid.innerHTML = '';

            for (let i = 1; i <= numQuestions; i++) {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.innerHTML = `<span>${i})</span><div class="options"></div>`;

                const optionsDiv = questionDiv.querySelector('.options');

                for (let j = 0; j < numOptions; j++) {
                    const optionSpan = document.createElement('span');
                    optionSpan.className = 'option';
                    optionSpan.innerText = String.fromCharCode(65 + j);
                    optionSpan.onclick = toggleSelection;
                    optionsDiv.appendChild(optionSpan);
                }

                bubbleGrid.appendChild(questionDiv);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            updateQuestions();

            document.getElementById('num-questions').addEventListener('input', updateQuestions);
            document.getElementById('num-options').addEventListener('input', updateQuestions);
        });
    </script>
</head>
<body>
    <div class="sidebar">
        <div class="logo">
            <h1>GradeFalcon</h1>
        </div>
        <nav>
            <ul>
                <li><a href="Dashboard.html">Dashboard</a></li>
                <li><a href="Schedule.html">Schedule</a></li>
                <li><a href="ExamBoard.html">Exam Board</a></li>
                <li><a href="GradeReport.html">Grade Report</a></li>
                <li><a href="Classes.html">Classes</a></li>
                <li><a href="AccountSettings.html">Account Settings</a></li>
                <li><a href="NotificationPreferences.html">Notification Preferences</a></li>
                <li><a href="Logout.html">Logout</a></li>
            </ul>
        </nav>
    </div>
    <div class="main-content">
        <header>
            <h2>Create New Exam</h2>
        </header>
        <section class="new-exam">
            <button class="btn">Create</button>
            <button class="btn">Configure</button>
            <button class="btn">Publish</button>
            <h3>Questions</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
                <label for="num-questions">#Questions:</label>
                <input type="number" id="num-questions" class="input-field" value="80" min="1" max="300">
                
                <label for="num-options">#Options per question:</label>
                <input type="number" id="num-options" class="input-field" value="5" min="1" max="26">
                
                <div class="nested-window">
                    <div class="bubble-grid"></div>
                </div>
                
                <a href="ExamControls.html" class="btn">Next</a>
            </form>
        </section>
    </div>
</body>
</html>