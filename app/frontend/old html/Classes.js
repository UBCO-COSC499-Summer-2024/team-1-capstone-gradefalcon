<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GradeFalcon Classes</title>
    <link rel="stylesheet" href="../style.css">
    <style>
.class-list {
    margin-bottom: 40px;
}

.class-card {
    background-color: white;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.class-card h4 {
    font-size: 18px;
    margin-bottom: 5px;
}

.class-card p {
    font-size: 14px;
    color: #555;
}

.new-class {
    background-color: white;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
}

.new-class h3 {
    font-size: 20px;
    font-weight: normal;
    margin-bottom: 10px;
}

.new-class p {
    font-size: 14px;
    margin-bottom: 20px;
    color: #555;
}

.upload-area {
    text-align: center;
}

.drag-drop-area {
    width: 100%;
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #777;
    cursor: pointer;
    margin-bottom: 20px;
}

.import-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.import-btn:hover {
    background-color: #45a049;
}

    </style>
</head>
<body>
   
    <div class="main-content">
        <header>
            <h2>Classes</h2>
        </header>
        <section class="class-list">
            <h3>Your Classes</h3>
            <div class="class-card">
                <h4><a href="ClassManagement.html">Class 1</a></h4>
                <p>Details about Class 1</p>
            </div>
            <div class="class-card">
                <h4><a href="ClassManagement.html">Class 2</a></h4>
                <p>Details about Class 2</p>
            </div>
            <!-- Add more class cards as needed -->
        </section>
        <section class="new-class">
            <h3>Create a new class</h3>
            <p>Import a CSV file containing the student names and their student IDs in your class.</p>
            <div class="upload-area">
                <input type="file" id="file-input" hidden>
                <div class="drag-drop-area" onclick="document.getElementById('file-input').click();">
                    <p>Click to browse or drag and drop your files</p>
                </div>
                <button class="import-btn">Import</button>
            </div>
        </section>
    </div>
</body>
</html>
