import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const Trial = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load face-api models and start the video stream
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "../.." + '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      // Optionally, load additional models if needed:
      // await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      // await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      // await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing webcam:", err));
    };

    loadModels();
  }, []);

  // Run face detection once the video starts playing
  useEffect(() => {
    const handleVideoPlay = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);

      const interval = setInterval(async () => {
        // Detect faces using the Tiny Face Detector
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        // Resize the detection results to match the display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        // Clear the canvas before drawing new detections
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // Draw the detection boxes on the canvas
        faceapi.draw.drawDetections(canvas, resizedDetections);
      }, 100);

      return () => clearInterval(interval);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('play', handleVideoPlay);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('play', handleVideoPlay);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '720px', height: '560px' }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        style={{ position: 'absolute' }}
      />
      <canvas
        ref={canvasRef}
        width="720"
        height="560"
        style={{ position: 'absolute' }}
      />
    </div>
  );
};

export default Trial;
