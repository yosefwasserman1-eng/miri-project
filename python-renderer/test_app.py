import pytest
from unittest.mock import MagicMock, patch
import json
import os
import sys

# Ensure the app module can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

@pytest.fixture
def client():
    from app import app
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('app.VideoFileClip')
@patch('app.AudioFileClip')
@patch('app.concatenate_videoclips')
def test_render_endpoint(mock_concat, mock_audio_clip, mock_video_clip, client):
    # Setup mocks
    mock_video_instance = MagicMock()
    mock_video_clip.return_value = mock_video_instance

    mock_audio_instance = MagicMock()
    mock_audio_clip.return_value = mock_audio_instance

    mock_final_clip = MagicMock()
    mock_concat.return_value = mock_final_clip

    # Mock with_audio on the final clip (moviepy v2)
    mock_final_with_audio = MagicMock()
    mock_final_clip.with_audio.return_value = mock_final_with_audio

    # Payload
    payload = {
        "clips": ["clip1.mp4", "clip2.mp4"],
        "audio": "audio.mp3",
        "output": "final_output.mp4"
    }

    # Make request
    response = client.post('/render',
                           data=json.dumps(payload),
                           content_type='application/json')

    # Assertions
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    assert data['output_path'] == 'final_output.mp4'

    # Verify calls
    assert mock_video_clip.call_count == 2
    mock_video_clip.assert_any_call("clip1.mp4")
    mock_video_clip.assert_any_call("clip2.mp4")

    mock_audio_clip.assert_called_once_with("audio.mp3")

    mock_concat.assert_called_once()
    # Check that concat was called with a list of clips
    args, _ = mock_concat.call_args
    assert len(args[0]) == 2

    mock_final_clip.with_audio.assert_called_once_with(mock_audio_instance)

    mock_final_with_audio.write_videofile.assert_called_once_with("final_output.mp4", codec="libx264", audio_codec="aac")

def test_render_missing_data(client):
    payload = {
        "clips": ["clip1.mp4"]
        # Missing audio
    }
    response = client.post('/render',
                           data=json.dumps(payload),
                           content_type='application/json')
    assert response.status_code == 400
