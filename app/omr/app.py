# from flask import Flask, request, jsonify
# import cv2
# import torch
# import numpy as np

# app = Flask(__name__)

# # Load YOLO model (example with YOLOv5)
# model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# @app.route('/detect', methods=['POST'])
# def detect():
#     file = request.files['image']
#     img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
#     results = model(img)
#     return jsonify(results.pandas().xyxy[0].to_dict(orient="records"))

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)
