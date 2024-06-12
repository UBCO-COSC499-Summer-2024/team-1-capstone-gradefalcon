<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Exam Controls</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
            margin-left: 5px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 17px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(13px);
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

        .controls {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
            background-color: white;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
            width: 350px;
        }

        .control-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .control-item span {
            flex-grow: 1;
        }
    </style>
</head>
<body>
    <div class="main-content">
        <header>
            <h2>Create New Exam</h2>
        </header>
        <section class="exam-controls">
            <button class="btn">Create</button>
            <button class="btn">Configure</button>
            <button class="btn">Publish</button>
            <div class="controls">
                <div class="control-item">
                    <span>Students can view their exam</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-item">
                    <span>Students can view correct answers</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="control-item">
                    <span>Students can see exam statistics</span>
                    <label class="switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <a href="ExamBoard.html" class="btn">Confirm</a>
        </section>
    </div>
</body>
</html>
