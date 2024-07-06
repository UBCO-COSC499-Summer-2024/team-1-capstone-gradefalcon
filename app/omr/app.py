from flask import Flask, request, jsonify
import os
import subprocess

app = Flask(__name__)

@app.route('/process-omr', methods=['POST'])
def process_omr():
    file = request.files['file']
    file_path = os.path.join('/app/inputs', file.filename)
    file.save(file_path)

    # Call the main.py script to process the OMR
    process = subprocess.run(
        ["python3", "main.py", "--inputDir", "/app/inputs/", "--outputDir", "/app/outputs/"],
        capture_output=True, text=True
    )

    if process.returncode != 0:
        return jsonify({"error": process.stderr}), 500

    return jsonify({"message": "Processing complete", "output": process.stdout})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9091)
