import React, { useRef, useEffect } from "react";
import domtoimage from "dom-to-image";
function UserVideoShot(props) {
  const webcamRef = useRef(null);

  useEffect(() => {
    // 웹캠 스트림 가져오기
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  }, []);

  useEffect(() => {
    console.log(props.time);
    if (props.time === 0) {
      copyCapture(webcamRef);
    }
    console.log(props.time);
  }, [props.time]);

  return (
    <video
      ref={webcamRef}
      autoPlay
      playsInline
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

function copyCapture(element) {
  if (element) {
    domtoimage
      .toPng(element)
      .then(function (dataUrl) {
        console.log(dataUrl);
        const link = document.createElement("a");
        link.download = "capture.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }
}

export default UserVideoShot;
