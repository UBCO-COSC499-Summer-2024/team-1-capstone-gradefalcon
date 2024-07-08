from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process_omr():
    data = request.json
    file_path = data['filePath']
    
    # Extract the directory from the file path
    input_dir = os.path.dirname(file_path)
    
    try:
        # Run the OMR processing script
        result = subprocess.run(
            ["python3", "main.py", "--inputDir", input_dir, "--outputDir", "/app/outputs"],
            capture_output=True,
            text=True,
            check=True
        )

        # Check the output for any relevant information
        output = result.stdout
        errors = result.stderr

        return jsonify({"output": output, "errors": errors})

    except subprocess.CalledProcessError as e:
        return jsonify({"error": str(e), "output": e.stdout, "errors": e.stderr}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
