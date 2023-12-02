import React, { useState } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

var mediaRecorder;
var audioChunks = [];

function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");

  const startRecording = () => {
    audioChunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        console.log("stream begin");
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
          setAudioUrl(URL.createObjectURL(audioBlob));
        };

        mediaRecorder.start();
        setRecording(true);
        console.log(mediaRecorder);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  const stopRecording = () => {
    console.log("stop-----");
    console.log(mediaRecorder);
    console.log(mediaRecorder.state);
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const saveRecording = () => {
    console.log(audioBlob);
    console.log(typeof audioBlob);
    if (audioBlob) {
      const gameSeq = 122;
      const userSeq = 10;

      const formData = new FormData();
      formData.append("gameSeq", 122);
      formData.append("userSeq", 10);
      formData.append("audio", audioBlob, "recording.wav");

      axios
        .post("https://localhost:8443/upload/user/audio", formData, {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhanVmcmVzaEBnbWFpbC5jb20iLCJpYXQiOjE2OTIyNjEyODAsImV4cCI6MTY5MjI2MzA4MCwic3ViIjoic3NhZnlAbmF2ZXIuY29tIiwiaWQiOiJzc2FmeUBuYXZlci5jb20ifQ.VfUMesv88r5dRRakpBDmM6AGF3A5TyFlhh3CFuPeuqc`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Recording saved successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error saving recording:", error);
        });
    }
  };

  return (
    <div>
      <h1>Audio Recorder</h1>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
          <button onClick={saveRecording}>Save Recording</button>
        </div>
      )}
    </div>
  );
}

export default Recorder;
