/* eslint-disable */
import {
  Chat as ChatIcon,
  Check as CheckIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import {
  styled,
  Button,
  Card,
  Container,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { fetchToken, closeSession, setSession } from "../../store"; // 추가된 액션 import
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import UserVideoShot from "../../components/Game/UserVideoShot";
import Header from "../../components/Game/HeaderPlay";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

var sock = new SockJS("https://i9b109.p.ssafy.io:8443/stomp/chat");
var stomp = Stomp.over(sock);

function GamePlay() {
  const { gameSeq } = useParams(); // 여기서 gameSeq를 가져옴
  const navigate = useNavigate(); // 페이지 이동
  const dispatch = useDispatch(); // 리덕스 넣기
  const session = useSelector(state => state.roomState.session);
  const connectionToken = useSelector(state => state.roomState.connectionToken);
  const { connectWebSocket, sendGameStartMessage } = useWebSocket();

  // Record 기능을 위한 코드 Start
  // ///////////////////////////

  const [isRecording, setIsRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const handleToggleRecording = () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const streamPromise = navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamPromise.then(stream => {
        setIsRecording(true);
        setAudioChunks([]);
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) {
            setAudioChunks(chunks => [...chunks, e.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          setAudioBlob(audioBlob);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      });
    }
  };

  const handlePlayAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    }
  };

  // ///////////////////////////
  // Record 기능을 위한 코드 End

  // 가사 순서 변화 실행을 위한 코드 Start
  // ///////////////////////////

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1); // 현재 인덱스 상태 추가
  // const timeRanges = []; // 예시 시간 범위 배열 (여기 부분을 lyrics에서 시작시간, 끝시간 가져와야함)
  const [timeRanges, setTimeRanges] = useState([]);
  const bringTimeRanges = async () => {
    try {
      const headers = {
        Authorization: "Bearer " + getCookie("access"),
      };
      const response = await axios.get(
        `https://i9b109.p.ssafy.io:8443/lyrics/118`,
        { headers }
      );
    } catch (error) {}
  };

  const handlePlayButtonClick = () => {
    setIsPlaying(true);
    startTimer();
    setCurrentIndex(0); // 처음 인덱스로 값을 초기화
  };

  const startTimer = () => {
    const timerInterval = 1000; // 1초마다 타이머 업데이트
    let currentTime = 0;

    const timer = setInterval(() => {
      currentTime += timerInterval / 1000; // 초 단위로 업데이트

      timeRanges.forEach(([startTime, endTime], index) => {
        if (currentTime >= startTime && currentTime <= endTime) {
          console.log(`Dynamic change at time ${currentTime}`);
          setCurrentIndex(index); // 현재 인덱스 업데이트
        }
      });

      if (currentTime >= timeRanges[timeRanges.length - 1][1]) {
        clearInterval(timer);
        setIsPlaying(false);
        setCurrentIndex(-1); // 인덱스 초기화
      }
    }, timerInterval);
  };

  // ///////////////////////////
  // 가사 순서 변화 실행을 위한 코드 End

  useEffect(() => {
    console.log("-------stomp not connect");
    stomp.connect({}, () => {
      console.log("---------stomp connect");
      // 특정 토픽 구독
      stomp.subscribe(`/subscribe/song/${gameSeq}`, message => {
        console.log("video start");
        setVideoVisible(true);
      });
    });
    // 컴포넌트 unmount 시 웹소켓 연결 해제 및 구독 해제
    return () => {
      if (stomp.connected) {
        stomp.unsubscribe(`/subscribe/song/${gameSeq}`);
        stomp.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // connectWebSocket(gameSeq);
  }, [gameSeq]);

  // 해당 노래 영상 가져오기
  const [songSeq, setSongSeq] = useState(116);
  const [musicUrl, setMusicUrl] = useState("");

  const bringUrl = async () => {
    const headers = {
      Authorization: "Bearer " + getCookie("access"),
    };
    const result = await axios.get(
      `https://i9b109.p.ssafy.io:8443/music/play/${songSeq}`,
      {
        headers,
      }
    );
    console.log(result.data.data.url);
    setMusicUrl(result.data.data.url);
  };

  useEffect(() => {
    bringUrl();
  }, []);

  // 버튼 클릭 시, 3초 후 노래 재생
  const [videoVisible, setVideoVisible] = useState(false);

  const handleButtonClick = () => {
    console.log("게임 시작 버튼 누름");
    if (stomp.connected) {
      console.log("연결 후 자동 재생 요청");
      const message = {
        gameSeq: gameSeq,
        // 필요한 경우 여기에 다른 데이터 추가
      };
      stomp.send("/public/song", {}, JSON.stringify(message));
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url('/images/GameImage/GameList.jpg')",
        fontFamily: "Ramche",
      }}
    >
      <Header />

      {/* Top */}
      <Grid container>
        <Grid container alignItems="center" justifyContent="center">
          <Card
            style={{
              width: "65vw",
              height: "55vh",
              background: "transparent",
              borderRadius: "30px",
              fontFamily: "Ramche",
            }}
          >
            {/* Record 기능을 위한 코드 Start */}
            {/*  */}
            <div>
              <button onClick={handleToggleRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button>
              <button onClick={handlePlayAudio} disabled={!audioBlob}>
                Play Recorded Audio
              </button>
            </div>
            {/*  */}
            {/* Record 기능을 위한 코드 End */}

            <button
              onClick={() => {
                handleButtonClick();
                handlePlayButtonClick();
              }}
              disabled={isPlaying}
            >
              Music Start
            </button>
            {currentIndex !== -1 && (
              <p style={{ color: "white" }}>노래 순서: {currentIndex + 1}</p>
            )}
            {videoVisible && (
              <video
                controls={false}
                autoPlay
                loop
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                src={musicUrl}
                type="video/mp4"
              ></video>
            )}
          </Card>
        </Grid>

        {/* Bottom */}
        <Grid
          style={{
            height: "20vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "50px",
          }}
        >
          {/* Player 1 */}
          <Grid
            item
            xs={2}
            style={{
              backgroundColor: "black",
              height: "20vh",
              border: "2px solid white",
              padding: "2px",
              margin: "5px",
              borderRadius: "20px",
            }}
          >
            {/* <UserVideo roomSession={session} userToken={connectionToken} /> */}
          </Grid>
          <Grid item xs={1} style={{ height: "20vh" }}>
            <div
              style={{
                fontFamily: "Pretendard-Regular",
                fontSize: "20px",
                color: "white",
                padding: "5px",
              }}
            >
              첫번째 선수
            </div>
          </Grid>
          {/* Player 2 */}
          <Grid
            item
            xs={2}
            style={{
              backgroundColor: "black",
              height: "20vh",
              border: "2px solid white",
              padding: "2px",
              margin: "5px",
              borderRadius: "20px",
            }}
          >
            {/* <UserVideo /> */}
          </Grid>
          <Grid item xs={1} style={{ height: "20vh" }}>
            <div
              style={{
                fontFamily: "Pretendard-Regular",
                fontSize: "20px",
                color: "white",
                padding: "5px",
              }}
            >
              두번째 선수
            </div>
          </Grid>
          {/* Player 3 */}
          <Grid
            item
            xs={2}
            style={{
              backgroundColor: "black",
              height: "20vh",
              border: "2px solid white",
              padding: "2px",
              margin: "5px",
              borderRadius: "20px",
            }}
          >
            {/* <UserVideo /> */}
          </Grid>
          <Grid item xs={1} style={{ height: "20vh" }}>
            <div
              style={{
                fontFamily: "Pretendard-Regular",
                fontSize: "20px",
                color: "white",
                padding: "5px",
              }}
            >
              세번째 선수
            </div>
          </Grid>
          {/* Player 4 */}
          <Grid
            item
            xs={2}
            style={{
              backgroundColor: "black",
              height: "20vh",
              border: "2px solid white",
              padding: "2px",
              margin: "5px",
              borderRadius: "20px",
            }}
          >
            {/* <UserVideo /> */}
          </Grid>
          <Grid item xs={1} style={{ height: "20vh" }}>
            <div
              style={{
                fontFamily: "Pretendard-Regular",
                fontSize: "20px",
                color: "white",
                padding: "5px",
              }}
            >
              네번째 선수
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default GamePlay;
