from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, resources={r"/get_next_video": {"origins": "*"}, r"/static/videos/*": {"origins": "*"}})

# Video sequences
videos = {
    "greeting": ["1.mp4", "2.mp4"],
    "personal": ["4.mp4", "5.mp4", "6.mp4", "9.mp4", "10.mp4", "11.mp4", "Thank.mp4"],
    "home": ["15.mp4", "16.mp4", "17.mp4", "18.mp4", "20.mp4", "21.mp4", "Thank.mp4"],
    "auto": ["23.mp4", "24.mp4", "25.mp4", "26.mp4", "27.mp4", "Thank.mp4"],
    "business": ["30.mp4", "31.mp4", "32.mp4", "33.mp4", "34.mp4", "Thank.mp4"]
}

@app.route('/get_next_video', methods=['POST'])
def get_next_video():
    data = request.json
    video_type = data.get("type", "greeting")
    index = int(data.get("index", 0))  # Ensure index is an integer

    if video_type in videos and 0 <= index < len(videos[video_type]):
        video_url = f"http://localhost:5000/static/videos/{videos[video_type][index]}"
        return jsonify({"video": video_url})
    
    return jsonify({"video": None})  # Return None if no video available

# Serve static files (videos)
@app.route('/static/videos/<path:filename>')
def serve_video(filename):
    return send_from_directory("static/videos", filename)

if __name__ == '__main__':
    app.run(debug=True)