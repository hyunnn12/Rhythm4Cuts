/* eslint-disable */
import {
  setSession as userSession,
  setConnection,
  setConnectionToken,
  resetRoomState,
  setPlayers,
  setGameseq,
} from "../../store";
import {
  Chat as ChatIcon,
  Check as CheckIcon,
  ExitToApp as ExitToAppIcon,
  PersonAdd as PersonAddIcon,
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
import { createConnection } from "../../openvidu/connectionInitialization";
import UserVideoComponent from "../../components/Game/UserVideoComponent";
import React, { Component, useState, useEffect } from "react";
import LoginAlert from "../../components/Common/LoginAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Game/HeaderPlay";
import Next from "../../components/Game/NextToPlay";
import { getCookie } from "../../utils/cookie";
import { userInfo } from "../../apis/userInfo";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";

function GameWait() {

  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false); // 로그인 알람
  const dispatch = useDispatch(); // 리덕스 업데이트
  const navigate = useNavigate(); // 페이지 이동

  var { gameSeq } = useParams(); // url에서 추출

  dispatch(setGameseq(gameSeq));

  const session = useSelector(state => state.roomState.session);

  const [myUserName, setMyUserName] = useState(undefined);
  const [connectSession, setConnectSession] = useState(undefined);

  const [mainStreamManager, setMainStreamManager] = useState(undefined); // 방장
  const [publisher, setPublisher] = useState(undefined); // 자신
  const [subscribers, setSubscribers] = useState([]); // 구독자 
  const [players, setPlayers] = useState([]);  // 통합

  // 로그인 상태를 업데이트하는 함수
  const handleOpenLoginAlert = () => {
    setLoginAlertOpen(true);
  };
  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false);
    navigate("/Login");
  };

  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기
  const [isSessionJoined, setSessionJoined] = useState(false); // 세션에 참여했는지 여부

  // Styled 버튼 ( css )
  const StyledIconButton = styled(IconButton)({
    color: "white",
    margin: "20px",
    boxShadow: "10px 5px 5px rgba(0, 0, 0, 0.8)",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "#1976d2", // 마우스 오버 시 배경색 변경
    },
  });

  // 로그인 상태관리
  useEffect(() => {
    connectWebSocket();
    userInfo()
      .then(res => {
        if (res.status === 200) {
        } else {
          // 로그인 상태가 아니라면 알림.
          handleOpenLoginAlert();
        }
      })
      .catch(error => {
        // 오류가 발생하면 로그인 알림.
        handleOpenLoginAlert();
      });
  }, []);

  useEffect(() => {
    userInfo()
      .then(res => {
        if (res.status !== 200) {
          window.alert("로그인을 해주세요!");
          navigate("/");
        }
      })
      .catch(error => {
        console.error("유저 정보 불러오기 실패:", error);
        window.alert("로그인을 해주세요!");
        navigate("/");
      });
  }, [gameSeq]);

  // 페이지 떠날 때 이벤트 리스너 등록 및 해제
  useEffect(() => {
    // beforeunload는 웹 브라우저에서 발생하는 이벤트 중 하나로, 사용자가 현재 페이지를 떠날 때 발생하는 이벤트
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  // 시작 -----------------------------------------------------------------------------------------------------
  // 유저 토큰 발급
  async function getToken() {
    let res = await fetchConnectionToken();
    return res["connectionToken"];
  }

  async function fetchConnectionToken() {
    try {
      await fetchSession();

      return await createConnection();
    } catch (error) {
      console.error("연결 토큰을 가져오는데 실패하였습니다:", error);
    }
  }

  const access = getCookie("access");

  // 방 세션 가져오기
  async function fetchSession() {
    try {

      // 방 인원수 Axios 1. 들어올때, 인원 수 추가하기 ( 4명 초과면 아웃! )
      try {
        await axios.get(
          `https://i9b109.p.ssafy.io:8443/lobby/room/${gameSeq}`,
          {
            headers: {
              Authorization: "Bearer " + access,
            },
          }
        );
      } catch (error) {
        window.alert("방인원수가 초과되었습니다. 게임 리스트 페이지로 이동합니다. ");
        navigate(`/GameList`);
      }

      // 방 세션 DB에서 가져오기 
      const response = await axios.get(
        `https://i9b109.p.ssafy.io:8443/wait/info/${gameSeq}`,
        {
          headers: {
            Authorization: "Bearer " + access,
          },
        }
      );

      dispatch(userSession(response.data.data.sessionId));
    } catch (error) {
      console.error("DB에서 세션 id 불러오기 실패:", error);
    }
  }

  // ------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSessionJoined) { // 세션에 참여하지 않았을 때만 실행
      const joinSessionTimeout = setTimeout(() => {
        joinSession();
      }, 2000);

      return () => clearTimeout(joinSessionTimeout);
    }
  }, [isSessionJoined]);

  // --------------------------------------------------------------------------------------------------------------
  const joinSession = async () => {
    try {

      if (connectSession) {
        console.log("이미 세션에 참여한 경우 중복 호출 방지");
        return;
      }

      const ov = new OpenVidu();
      const newSession = ov.initSession();
      setConnectSession(newSession);

      newSession.on("streamCreated", event => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);

        setPlayers(prevPlayers => [...prevPlayers, subscriber]); // 플레이어 스트림 추가

        if (!mainStreamManager) {
          setMainStreamManager(subscriber);
        }
      });

      newSession.on("streamDestroyed", event => {
        deleteSubscriber(event.stream.streamManager);
      });

      newSession.on("exception", exception => {
        console.warn(exception);
      });

      const token = await getToken(); // Implement getToken function

      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          const newPublisher = await ov.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          //--------------------------

          // <<Before>>
          //   newSession.publish(newPublisher);

          //   const devices = await ov.getDevices();
          //   const videoDevices = devices.filter(
          //     device => device.kind === "videoinput"
          //   );
          //   const currentVideoDeviceId = newPublisher.stream
          //     .getMediaStream()
          //     .getVideoTracks()[0]
          //     .getSettings().deviceId;
          //   const currentVideoDevice = videoDevices.find(
          //     device => device.deviceId === currentVideoDeviceId
          //   );

          //   setMainStreamManager(newPublisher);
          //   setPublisher(newPublisher);

          //   if (players.length === 0) { // 방장을 플레이어 스트림 추가
          //     setPlayers(prevPlayers => [...prevPlayers, newPublisher]);
          //   }

          // <<After>>
          newSession.publish(newPublisher);

          setPublisher(newPublisher);
          setMainStreamManager(newPublisher);
          setPlayers(prevPlayers => [...prevPlayers, newPublisher]);

          //--------------------------
        })
        .catch(error => {
          console.log(
            "There was an error connecting to the session:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  // "친구 초대" 버튼을 눌렀을 때 동작 ------------------------------------------------------------------------------
  const handleAddFriend = () => {
    console.log("친구 초대 버튼 클릭!");
    InviteFriend();
  };

  // 친구 초대
  function InviteFriend() {
    var request = {
      fromUser: fromUser,
      toUser: toUser,
      // roomNumber :
    };
    if (stomp.connected) {
      stomp.send("/public/request", {}, JSON.stringify(request));
    }
  }

  // "게임 준비" 버튼을 클릭했을 때 동작 -----------------------------------------------------------------------------
  function handleGameReady() {
    dispatch(userSession(session));
    dispatch(setConnection(connection));
    navigate(`/GamePlay/${gameSeq}`);
  }

  // "채팅" 버튼을 클릭했을 때 동작 ---------------------------------------------------------------------------------
  const handleChat = () => { };

  // "나가기" 버튼 눌렀을 때 동작 -----------------------------------------------------------------------------------
  const handleExit = () => {
    onBeforeUnload();
    console.log("방 나갈거야 ~");

    navigate(`/GameList`);
  };

  const onBeforeUnload = () => {
    leaveSession();
  };

  // 방에서 나갈때 ㅣ 수정 필요 
  const leaveSession = () => {
    console.log("--------------------leave session");
    // 방 인원수 Axios 2. 나갈때  axios 인원 수 줄이기
    axios.get(
      `https://i9b109.p.ssafy.io:8443/lobby/room/exit/${gameSeq}`,
      {
        headers: {
          Authorization: "Bearer " + access,
        },
      }
    );

    // 나가는 플레이어를 찾아서 배열에서 제거
    const updatedPlayers = players.filter(player => player !== publisher);
    // 상태 업데이트
    setPlayers(updatedPlayers); // 나간 플레이어를 제외한 플레이어 목록으로 상태 업데이트


    // 구독 중인 스트림 해제
    subscribers.forEach(subscriber => subscriber.unsubscribe());

    if (publisher) {
      // 자신의 스트림 해제
      if (publisher.stream && typeof publisher.stream.dispose === "function") {
        publisher.stream.dispose();
      }
    }

    if (connectSession) {
      connectSession.disconnect(); // 현재 유저 커넥션 연결을 끊음
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
      }}
    >
      <Header />

      <Grid container>
        {/* 멘트
        <Grid
          container
          style={{
            display: "flex",
            justifyContent: "center",
            zIndex: 1, // z-index를 1로 설정하여 비디오 위에 텍스트가 나타나도록
          }}
        >
          <Typography
            variant="h4"
            style={{
              fontFamily: "Pretendard-Regular",
              fontWeight: "bold",
              fontSize: "10px",
              color: "red",
            }}
          >
            전원 준비가 되면 게임이 시작합니다 악!
          </Typography>
        </Grid> */}

        {/* TOP */}
        <Grid container>
          {/* Top : LEFT */}
          <Grid
            item
            xs={8}
            container
            alignItems="center"
            justifyContent="center"
            paddingLeft={"150px"}
          >
            <Card
              style={{
                width: "55vw",
                height: "40vh",
                background: "transparent",
                borderRadius: "30px",
              }}
            >
              {/* 대기중 비디오 */}
              <video
                src="/images/GameImage/Dance.mp4"
                autoPlay
                loop
                style={{
                  width: "100%",
                  height: "40vh",
                  objectFit: "cover",
                }}
              />
            </Card>
          </Grid>

          {/* Top : RIGHT */}
          <Grid item
            xs={4} container
            alignItems="center"
            justifyContent="center">

            <Grid container spacing={2}>
              {/* 친구 초대 버튼 */}
              <Grid item xs={5} style={{ margin: "1px" }}>
                <StyledIconButton onClick={handleAddFriend} style={{ width: "12vw" }}>
                  <PersonAddIcon />
                  <Typography
                    style={{
                      fontFamily: "Pretendard-Regular",
                      fontSize: "20px",
                      padding: "15px",
                    }}
                  >
                    친구 초대
                  </Typography>
                </StyledIconButton>
              </Grid>

              {/* "게임준비" 버튼 */}
              <Grid item xs={5} style={{ margin: "1px" }}>
                <StyledIconButton onClick={handleGameReady} style={{ width: "12vw" }}>
                  <CheckIcon />
                  <Typography
                    style={{
                      fontFamily: "Pretendard-Regular",
                      fontSize: "20px",
                      padding: "15px",
                    }}
                  >
                    게임 준비
                  </Typography>
                </StyledIconButton>
              </Grid>

              {/* "채팅" 버튼 */}
              <Grid item xs={5} style={{ margin: "1px" }}>
                <StyledIconButton onClick={handleChat} style={{ width: "12vw" }} >
                  <ChatIcon />
                  <Typography
                    style={{
                      fontFamily: "Pretendard-Regular",
                      fontSize: "20px",
                      padding: "15px",
                    }}
                  >
                    채팅
                  </Typography>
                </StyledIconButton>
              </Grid>

              {/* "나가기" 버튼 */}
              <Grid item xs={5} style={{ margin: "1px" }}>
                <StyledIconButton onClick={handleExit} style={{ width: "12vw" }} >
                  <ExitToAppIcon />
                  <Typography
                    style={{
                      fontFamily: "Pretendard-Regular",
                      fontSize: "20px",
                      padding: "15px",
                    }}
                  >
                    나가기
                  </Typography>
                </StyledIconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom */}
        <Grid
          style={{
            height: "25vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "50px"

          }}
        >
          {/* Player 1 */}
          <Grid
            item
            xs={3}
            style={{
              backgroundColor: "transparent",
              height: "34vh",
              padding: "2px",
              margin: "20px",
              // border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            {/* {players[0] && (
              <UserVideoComponent
                streamManager={players[0]}
              // streamManager={publisher}
              // streamManager={subscribers[0]}
              // streamManager={mainStreamManager}
              />
            )} */}
            {players[0] ? (
              <UserVideoComponent
                streamManager={players[0]}
              />
            ) : (
              <video autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", }}>
                <source src="/videos/33.mp4" type="video/mp4" />
              </video>
            )}
          </Grid>

          {/* Player 2 */}
          <Grid
            item
            xs={3}
            style={{
              backgroundColor: "transparent",
              height: "34vh",
              padding: "2px",
              margin: "20px",
              // border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            {players[1] ? (
              <UserVideoComponent
                streamManager={players[1]}
              />
            ) : (
              <video autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", }}>
                <source src="/videos/33.mp4" type="video/mp4" />
              </video>
            )}
          </Grid>

          {/* Player 3 */}
          <Grid
            item
            xs={3}
            style={{
              backgroundColor: "transparent",
              height: "34vh",
              padding: "2px",
              margin: "20px",
              // border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            {players[2] ? (
              <UserVideoComponent
                streamManager={players[2]}
              />
            ) : (
              <video autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", }}>
                <source src="/videos/33.mp4" type="video/mp4" />
              </video>
            )}
          </Grid>

          {/* Player 4 */}
          <Grid
            item
            xs={3}
            style={{
              backgroundColor: "transparent",
              height: "34vh",
              padding: "2px",
              margin: "20px",
              // border: "2px solid white",
              borderRadius: "20px",
            }}
          >
            {players[3] ? (
              <UserVideoComponent
                streamManager={players[3]}
              />
            ) : (
              <video autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px", }}>
                <source src="/videos/33.mp4" type="video/mp4" />
              </video>
            )}
          </Grid>

        </Grid>
      </Grid>

      {/* '로그인 경고' 모달 */}
      <LoginAlert isOpen={isLoginAlertOpen} onClose={handleCloseLoginAlert} />
    </div>
  );
}
export default GameWait;
