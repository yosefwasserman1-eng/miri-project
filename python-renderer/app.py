from flask import Flask, request, jsonify
from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips
import os

app = Flask(__name__)

@app.route('/render', methods=['POST'])
def render():
    data = request.get_json()

    # Input validation
    if not data or 'clips' not in data or 'audio' not in data:
        return jsonify({"error": "Missing 'clips' or 'audio' field"}), 400

    clips = data.get('clips')
    audio_path = data.get('audio')
    output_path = data.get('output', 'output.mp4')

    if not isinstance(clips, list) or not clips:
        return jsonify({"error": "'clips' must be a non-empty list"}), 400

    try:
        # Create clip objects
        video_clips = [VideoFileClip(clip) for clip in clips]
        audio_clip = AudioFileClip(audio_path)

        # Concatenate video clips
        final_clip = concatenate_videoclips(video_clips)

        # Add audio
        final_clip = final_clip.with_audio(audio_clip) # using with_audio in moviepy v2

        # Write output file
        final_clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

        # Close clips to free resources
        for clip in video_clips:
            clip.close()
        audio_clip.close()
        final_clip.close()

        return jsonify({"status": "success", "output_path": output_path}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
