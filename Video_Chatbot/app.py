from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Video sequences
videos = {
    "greeting": ["1.mp4", "2.mp4"],  # Only first 2 videos
    "personal": ["4.mp4", "5.mp4", "6.mp4", "9.mp4", "10.mp4", "11.mp4", "Thank.mp4"],
    "home": ["15.mp4", "16.mp4", "17.mp4", "18.mp4", "20.mp4", "21.mp4", "Thank.mp4"],
    "auto": ["23.mp4", "24.mp4", "25.mp4", "26.mp4", "27.mp4", "Thank.mp4"],
    "business": ["30.mp4", "31.mp4", "32.mp4", "33.mp4", "34.mp4", "Thank.mp4"]
}


buffer_video = "buffer.mp4"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_next_video', methods=['POST'])
def get_next_video():
    data = request.json
    video_type = data.get("type")  # "greeting", "personal", etc.
    index = data.get("index", 0)

    if video_type in videos and index < len(videos[video_type]):
        return jsonify({"video": videos[video_type][index]})
    
    return jsonify({"video": None})  # No more videos


if __name__ == '__main__':
    app.run(debug=True)
