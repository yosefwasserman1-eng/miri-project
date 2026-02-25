# /python-renderer/Dockerfile
FROM python:3.11-slim

# התקנת FFmpeg ברמת מערכת ההפעלה של הקונטיינר
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# העתקת רשימת התלויות והתקנתן
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# העתקת שאר קבצי הפרויקט
COPY . .

EXPOSE 5000

CMD ["python", "app.py"]