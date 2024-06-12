<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Grade Report</title>
    <link rel="stylesheet" href="../style.css">
    <style>
    /*CSS not shared between student and instructor veiw for Grade Report because they 
will have acess to seperate/independant information and styles*/  
.chart {
    background-color: white;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.chart h3 {
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 10px;
}

.chart img {
    width: 100%;
    height: auto;
}

.placeholder {
    width: 100%;
    height: 200px;
    background-color: #f2f2f2;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #555;
    font-size: 16px;
}
 
    </style>
</head>
<body>
    <div class="main-content">
        <header>
            <h2>Grade Report</h2>
        </header>
        <section class="charts">
            <div class="chart">
                <h3>Graphic Fundamentals - Final Exam</h3>
                <div class="placeholder">Graph will be inserted here</div>
            </div>
            <div class="chart">
                <h3>Graphic Fundamentals - Midterm 1</h3>
                <div class="placeholder">Graph will be inserted here</div>
            </div>
            <div class="chart">
                <h3>Advanced Web Designs - Final Exam</h3>
                <div class="placeholder">Graph will be inserted here</div>
            </div>
            <div class="chart">
                <h3>Advanced Web Design - Midterm 1</h3>
                <div class="placeholder">Graph will be inserted here</div>
            </div>
        </section>
    </div>
</body>
</html>
