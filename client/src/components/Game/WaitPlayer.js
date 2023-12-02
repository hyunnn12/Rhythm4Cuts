// WaitPlayer.js
// 필요없을수도.

import { Card, CardContent, Box } from "@mui/material";
import { useSelector } from "react-redux";
import Webcam from "./Webcam"; // 웹캠 컴포넌트 불러오기
import React from "react";

function WaitPlayer({ playerId, gameSeq }) {
  const isReady = useSelector((state) => state.GameWait_Ready[playerId]);
  const webcamStream = useSelector((state) => state.webcamStream); // 웹캠 스트림 가져오기

  return (
    <Box>
      <Card
        sx={{
          width: "15vw",
          height: "32vh",
          position: "relative",
          fontFamily: 'Ramche',
        }}
      >
        {isReady && (
          <Box
            sx={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background:
                "linear-gradient(to top right, transparent 50%, green 50%)",
              opacity: 0.7,
              zIndex: 1,
              fontFamily: 'Ramche',
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "2em",
                color: "white",
                fontWeight: "bold",
                fontFamily: 'Ramche',
              }}
            >
              READY
            </Box>
          </Box>
        )}
        <CardContent>
          <Card
            sx={{
              height: "15vh",
              margin: "2%",
              fontFamily: 'Ramche',
            }}
          >
            {/* Webcam 컴포넌트를 사용하여 웹캠 스트림을 표시합니다. */}
            {webcamStream ? (
              <Webcam stream={webcamStream} />
            ) : (
              // 웹캠 스트림이 없을 경우 로딩 또는 기본 이미지 표시
              <div style={{fontFamily: 'Ramche',}}>Loading...</div>
            )}
          </Card>
        </CardContent>
        <Box sx={{ p: 1 }}>
          <Box style={{fontFamily: 'Ramche',}}>닉네임</Box>
          <Box style={{fontFamily: 'Ramche',}}>1 Player : 90% </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default WaitPlayer;
