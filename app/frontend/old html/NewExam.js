<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon New Exam</title>
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
    display: inline-block;
    text-align: center;
    text-decoration: none;
}

.btn:hover {
    background-color: #45a049;
}

form {
    display: flex;
    flex-direction: column;
}

    </style>
</head>
<body>
    <div class="main-content">
        <header>
            <h2>Create New Exam</h2>
        </header>
        <section class="new-exam">
            <button class="btn">Create</button>
            <button class="btn">Configure</button>
            <button class="btn">Publish</button>
            <h3>General</h3>
            <p>*The following details will be printed on the exam*</p>
            <form>
                <label for="exam-title">Exam Title:</label>
                <input type="text" id="exam-title" class="input-field" value="Graphic Fundamentals 101 Final Exam">
                
                <label for="test-duration">Test Duration:</label>
                <input type="text" id="test-duration" class="input-field" value="03:00:00">
                
                <label for="schedule">Schedule:</label>
                <div class="schedule-field">
                    <input type="date" id="start-date" class="input-field" value="2024-12-31">
                    <input type="time" id="start-time" class="input-field" value="13:00">
                    <input type="date" id="end-date" class="input-field" value="2024-12-31">
                    <input type="time" id="end-time" class="input-field" value="16:00">
                </div>
                
                <label for="answer-key">Answer Key:</label>
                <a href="UploadExamKey.html" class="btn">Upload Answer Key</a>
                <a href="ManualExamKey.html" class="btn">Manually Select Answers</a>

            </form>
        </section>
    </div>
</body>
</html>
