from flask import Flask, request, jsonify
import subprocess
import os
import logging

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_omr():
    data = request.get_json()
    file_path = data.get('filePath')
    
    if not file_path:
        return jsonify({"error": "filePath is required"}), 400

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({"error": f"File not found: {file_path}"}), 404

    try:
        # Run the OMR processing script
        result = subprocess.run(
            ["python3", "main.py"],
            capture_output=True,
            text=True,
            check=True
        )
        return jsonify({"output": result.stdout}), 200
    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e), "stderr": e.stderr}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
