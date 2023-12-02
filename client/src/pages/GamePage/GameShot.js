/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Button, Card, Grid, Typography, Container } from "@mui/material";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Game/HeaderPlay";
import { createSession } from "../../openvidu/sessionInitialization";
import { createConnection } from "../../openvidu/connectionInitialization";
import LoginAlert from "../../components/Common/LoginAlert";
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import { useNavigate, useParams } from "react-router-dom";
import { userInfo } from "../../apis/userInfo";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import Webcam from "react-webcam";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import NextToHome from "../../components/Game/NextToHome";

//close test
import { closeSession } from "../../store";
import UserVideoShot from "../../components/Game/UserVideoShot";
// import UserVideoComponent from "../../components/Game/UserVideoComponent";

const GameShot = () => {
  const [playerCaptured1, setPlayerCaptured1] = useState(true);
  const [playerCaptured2, setPlayerCaptured2] = useState(true);
  const [playerCaptured3, setPlayerCaptured3] = useState(true);
  const [playerCaptured4, setPlayerCaptured4] = useState(true);
  const [playerURL1, setPlayerURL1] = useState("/images/ShotEmpty.jfif");
  const [playerURL2, setPlayerURL2] = useState("/images/ShotEmpty.jfif");
  const [playerURL3, setPlayerURL3] = useState("/images/ShotEmpty.jfif");
  const [playerURL4, setPlayerURL4] = useState("/images/ShotEmpty.jfif");
  var { gameSeq } = useParams(); // url에서 추출
  const [doState, setDoState] = useState(false);
  const [stomp, setStomp] = useState(null); // stomp 객체 상태 추가

  useEffect(() => {
    if (!stomp) {
      // stomp 객체가 없을 때만 초기화
      const sock = new SockJS("https://i9b109.p.ssafy.io:8443/stomp/chat");
      const stompClient = Stomp.over(sock);

      stompClient.connect(
        {},
        function () {
          console.log("게임 페이지 안 웹소켓 연결.");
          stompClient.subscribe(
            `/subscribe/film/gameSeq/${gameSeq}/playerRank/1`,
            async (message) => {
              console.log("1메시지 받음");
              setPlayerCaptured1(true);
              const headers = {
                Authorization: "Bearer " + getCookie("access"),
              };
              const response = await axios
                .get(
                  `https://i9b109.p.ssafy.io:8443/film/photo/private/game/${gameSeq}/rank/1`,
                  { headers }
                )
                .then((res) => {
                  console.log(res.data.privateUrl);
                  setPlayerURL1(res.data.privateUrl);
                });
              // console.log(response.privateUrl);
            }
          );

          stompClient.subscribe(
            `/subscribe/film/gameSeq/${gameSeq}/playerRank/2`,
            async (message) => {
              console.log("2메시지 받음");
              setPlayerCaptured2(true);
              const headers = {
                Authorization: "Bearer " + getCookie("access"),
              };
              const response = await axios
                .get(
                  `https://i9b109.p.ssafy.io:8443/film/photo/private/game/${gameSeq}/rank/2`,
                  { headers }
                )
                .then((res) => {
                  console.log(res.data.privateUrl);
                  setPlayerURL2(res.data.privateUrl);
                });
              // console.log(response.privateUrl);
            }
          );

          stompClient.subscribe(
            `/subscribe/film/gameSeq/${gameSeq}/playerRank/3`,
            async (message) => {
              console.log("3메시지 받음");
              setPlayerCaptured3(true);
              const headers = {
                Authorization: "Bearer " + getCookie("access"),
              };
              const response = await axios
                .get(
                  `https://i9b109.p.ssafy.io:8443/film/photo/private/game/${gameSeq}/rank/3`,
                  { headers }
                )
                .then((res) => {
                  console.log(res.data.privateUrl);
                  setPlayerURL3(res.data.privateUrl);
                });
              // console.log(response.privateUrl);
            }
          );

          stompClient.subscribe(
            `/subscribe/film/gameSeq/${gameSeq}/playerRank/4`,
            async (message) => {
              console.log("4메시지 받음");
              setPlayerCaptured4(true);
              const headers = {
                Authorization: "Bearer " + getCookie("access"),
              };
              const response = await axios
                .get(
                  `https://i9b109.p.ssafy.io:8443/film/photo/private/game/${gameSeq}/rank/4`,
                  { headers }
                )
                .then((res) => {
                  console.log(res.data.privateUrl);
                  setPlayerURL4(res.data.privateUrl);
                });
              // console.log(response.privateUrl);
            }
          );
        },
        (error) => {
          console.log("STOMP 연결 실패:", error);
        }
      );

      setStomp(stompClient); // stomp 객체를 상태에 저장
    }
  }, [stomp]);

  const dispatch = useDispatch();

  const handleTestClose = async () => {
    try {
      const sessionData = await createSession();
      const sessionId = sessionData.id;
      const connectionData = await createConnection(sessionId);
      const connectionId = connectionData.connectionId;
      console.log("버튼 클릭 전 세션 데이터:", sessionData);
      console.log("버튼 클릭 전 연결 데이터:", connectionData);

      // closeSession 액션을 호출하여 세션을 종료합니다.
      await dispatch(closeSession({ sessionId, connectionId }));

      // 세션/연결 종료 후 상태 확인
      console.log("세션 종료 후 상태:", sessionData);
      console.log("세션 종료 후 상태:", connectionData);

      // 세션 종료 후 5초 후에 상태를 다시 확인
      setTimeout(async () => {
        const newSessionData = await createSession();
        const newSessionId = newSessionData.id;
        const newConnectionData = await createConnection(newSessionId);
        console.log("5초 후 세션 데이터:", newSessionData);
        console.log("5초 후 연결 데이터:", newConnectionData);
      }, 5000);
    } catch (error) {
      // closeSession 액션이 실패한 경우 에러 처리
      console.error("세션 종료 실패:", error);
    }
  };

  // 캡처된 이미지를 저장하는 상태 변수
  const [capturedImage, setCapturedImage] = useState(null);

  const navigate = useNavigate();

  const [userSeq, setUserSeq] = useState(0);
  //로그인 상태 확인
  try {
    userInfo()
      .then((res) => {
        if (res.status === 200) {
          setUserSeq(res.data.user_seq);
          console.log(userSeq);
        }
      })
      .catch((error) => {
        handleOpenLoginAlert();
      });
  } catch (error) {
    console.log(error);
  }
  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false); // 로그인 알람

  // 로그인 상태를 업데이트하는 함수
  const handleOpenLoginAlert = () => {
    setLoginAlertOpen(true);
  };
  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false);
    navigate("/Login");
  };

  // 사진을 찍는 타이머를 설정하기 위한 상태 변수
  const [shotSeconds, setShotSeconds] = useState(10);

  // 프레임 고르는 타이머를 설정하기 위한 상태 변수
  const [frameSeconds, setFrameSeconds] = useState(5);

  // 캡처가 완료되었는지 여부를 확인하는 상태 변수
  const [captured, setCaptured] = useState(false);

  // Frame 이미지 배열에서 현재 선택된 이미지의 인덱스를 저장하는 상태 변수
  const [imageIndex, setImageIndex] = useState(0);

  // 웹캠 캡처를 위한 참조 변수
  const captureRef = useRef(null);

  // 유저 이미지를 표시할 Card 요소를 위한 참조 변수
  const user1Ref = useRef(null);

  // 웹캠 컴포넌트를 표시하는 Webcam 컴포넌트를 위한 참조 변수
  const webcamRef = useRef(null);

  // Frame 이미지 배열을 리덕스 상태로부터 가져옵니다.
  let frameImage = useSelector((state) => state.GameShot_frameImage);

  // Ref를 최상위 레벨로 이동하고, DOM 요소를 가리킬 수 있도록 설정합니다.
  const copyRef = useRef(null);

  // 웹캠으로부터 스크린샷을 찍어 이미지를 캡처하는 함수
  // const handleCapture = useCallback(() => {
  //   if (webcamRef.current && !captured) {
  //     const screenshot = webcamRef.current.getScreenshot();
  //     if (screenshot) {
  //       // 이미지를 캡처하고 URL을 상태에 저장
  //       setCapturedImage(screenshot);

  //       // 캡처된 이미지를 user1Ref에 추가하여 표시
  //       const img = document.createElement("img");
  //       img.src = screenshot;
  //       img.style.objectFit = "cover";
  //       img.style.width = "100%";
  //       img.style.height = "100%";
  //       img.style.borderRadius = "5%";

  //       if (user1Ref.current) {
  //         // 캡처된 이미지를 user1Ref에 추가하여 표시합니다.
  //         while (user1Ref.current.firstChild) {
  //           user1Ref.current.firstChild.remove();
  //         }
  //         user1Ref.current.appendChild(img);
  //       }
  //       setCaptured(true);
  //       // copyCapture(copyRef.current); // 이건 4개 묶음 사진

  //       if (shotSeconds === 0) {
  //         // captureRef.current 요소를 이미지로 저장
  //         copyCapture(captureRef.current);
  //       }

  //       // 이미지 데이터를 파일로 다운로드
  //       const blob = dataURLtoBlob(screenshot);
  //       const url = URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = "captured_image.png";
  //       link.click();
  //     }
  //   }
  // }, [webcamRef, captured, shotSeconds]);
  // useEffect(() => {
  //   if (shotSeconds === 0) {
  //     console.log(shotSeconds);
  //     // captureRef.current 요소를 이미지로 저장
  //     copyCapture(captureRef.current);
  //   }
  // }, [shotSeconds]);
  // "captured" 상태가 변경될 때 메시지를 업데이트하는 useEffect 훅 추가
  // useEffect(() => {
  //   if (captured) {
  //     setShotSeconds(0); // "captured"가 true가 되면 "땡초 남았습니다~" 메시지를 강제로 "촬영이 완료되었습니다."로 변경합니다.
  //   }
  // }, [captured]);

  //  타이머를 설정하고 타이머가 끝나면 촬영 함수를 호출하거나 자동 촬영 함수를 호출합니다.
  useEffect(() => {
    const timerId = setInterval(() => {
      setShotSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          // handleCapture();
          clearInterval(timerId); // 타이머를 종료합니다.
          setDoState(true);

          return prevSeconds;
        } else {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          return prevSeconds;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [captured]);

  //frame timer
  useEffect(() => {
    const timerId = setInterval(() => {
      setFrameSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          // handleCapture();
          clearInterval(timerId); // 타이머를 종료합니다.
          setDoState(true);

          return prevSeconds;
        } else {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }
          return prevSeconds;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [captured]);

  // Frame 이미지 이전 버튼 핸들러
  const handlePrev = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? frameImage.length - 1 : prevIndex - 1
    );
  };

  // Frame 이미지 다음 버튼 핸들러
  const handleNext = () => {
    setImageIndex((prevIndex) =>
      prevIndex === frameImage.length - 1 ? 0 : prevIndex + 1
    );
  };

  const [gameResults, setGameResults] = useState([]);

  // 로그인 상태 확인
  useEffect(() => {
    userInfo()
      .then((res) => {
        if (res.status === 200) {
          const headers = {
            Authorization: "Bearer " + getCookie("access"),
          };
          // 로그인 상태일 때 axios로 데이터를 가져옴
          axios
            .get(`https://i9b109.p.ssafy.io:8443/wait/order/${gameSeq}`, {
              headers,
            })
            .then((response) => {
              // 가져온 데이터를 score 순서로 정렬하여 저장
              const sortedResults = response.data.sort(
                (a, b) => b.score - a.score
              );
              setGameResults(sortedResults);
            })
            .catch((error) => {
              console.error("Error fetching game results:", error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
        handleOpenLoginAlert();
      });
  }, [userSeq]);

  const [userRank, setUserRank] = useState(-1);

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [image, setImage] = useState("");

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);

    console.log(image);
    console.log(typeof image);
  }, [webcamRef]);

  const uploadImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("gameSeq", gameSeq);
      formData.append("userSeq", userSeq);
      formData.append("playerRank", userRank);
      formData.append("privateFilm", dataURLtoFile(image, "temp.jpg"));

      const headers = {
        Authorization: "Bearer " + getCookie("access"),
      };

      try {
        const response = await axios.post(
          "https://i9b109.p.ssafy.io:8443/film/private/film",
          formData,
          { headers }
        );
        console.log("Image uploaded successfully:", response.data);
        var request = {
          gameSeq: gameSeq,
          playerRank: userRank,
        };
        if (stomp.connected) {
          stomp.send("/public/film", {}, JSON.stringify(request));
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    gameResults.forEach((data, index) => {
      if (data.userSeq === userSeq) {
        setUserRank(index + 1);
        console.log(userRank);
      }
    });
    console.log(gameResults);
  }, [uploadImage, userSeq, gameSeq, userRank]);

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // useEffect(() => {
  //   console.log(gameSeq);
  //   console.log(userSeq);
  //   console.log(userRank);
  // }, [uploadImage]);

  // function copyCommonCapture(element) {
  //   if (element) {
  //     domtoimage.toPng(element).then(function (dataUrl) {
  //       const formData = new FormData();
  //       formData.append("gameSeq", gameSeq);
  //       formData.append("userSeq", userSeq);
  //       formData.append("commonFilm", dataURLtoFile(dataUrl, "temp.jpg"));
  //       const headers = {
  //         Authorization: "Bearer " + getCookie("access"),
  //       };
  //       try {
  //         console.log(1);
  //         const response = axios.post(
  //           "https://i9b109.p.ssafy.io:8443/film/common/film",
  //           formData,
  //           { headers }
  //         );
  //         console.log(response);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   }
  // }

  const [homestate, setHomeState] = useState(false);
  // useEffect(() => {
  //   setHomeState(true);
  // }, [copyCommonCapture]);

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
          setHomeState(true);
        })
        .catch(function (error) {
          console.error("oops, something went wrong!", error);
        });
    }
  }
  if (homestate) {
    navigate("/");
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundPosition: "center",
        backgroundSize: "cover",
        position: "relative",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url('/images/Game_Shot.png')",
      }}
    >
      {/* 상단 헤더 */}
      <Header />

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
        }}
      >
        <Grid container spacing={10}>
          {/* Webcam 영역 */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "95%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "black",
                  flex: "1 1 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "borderRadius",
                }}
              >
                {/* Webcam 컴포넌트를 표시합니다. */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,

                    backgroundColor: "white",
                  }}
                  ref={captureRef}
                >
                  {/* 비디오 나오게! */}
                  {/* <UserVideoShot time={shotSeconds} /> */}
                  <Webcam
                    style={{ height: "100%", width: "120%" }}
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                  />
                  {/* <button onClick={capture}>Capture Photo</button> */}
                  {image && (
                    <>
                      {/* <img src={image} alt="Captured" /> */}
                      {/* <button onClick={uploadImage}>Upload</button> */}
                    </>
                  )}
                </Box>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
              >
                {/* 촬영 버튼 */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    fontFamily: "Ramche",
                  }}
                >
                  {image ? (
                    <>
                      <Button
                        onClick={uploadImage}
                        style={{ fontFamily: "Ramche" }}
                      >
                        Upload
                      </Button>
                    </>
                  ) : (
                    <Button onClick={capture} style={{ fontFamily: "Ramche" }}>
                      촬영
                    </Button>
                  )}
                  {/* {homestate ? null : <NextToHome />} */}
                </div>
              </Box>
            </Box>
          </Grid>

          {/* Frame 이미지 영역 */}
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                // copyRef를 캡처하려는 DOM 요소에 연결합니다.
                ref={copyRef}
                sx={{
                  height: "80%",
                  width: "60%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "borderRadius",
                  backgroundImage: `url(${frameImage[imageIndex]})`,
                }}
              >
                {/* 유저 이미지를 표시하는 Card */}
                {playerCaptured1 ? (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url(${playerURL1})`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 1
                  </Card>
                ) : (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url("/images/ShotEmpty.jfif")`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 1
                  </Card>
                )}

                {playerCaptured2 ? (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url(${playerURL2})`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 2
                  </Card>
                ) : (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url("/images/ShotEmpty.jfif")`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 2
                  </Card>
                )}
                {playerCaptured3 ? (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url(${playerURL3})`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 3
                  </Card>
                ) : (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url("/images/ShotEmpty.jfif")`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 3
                  </Card>
                )}
                {playerCaptured4 ? (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url(${playerURL4})`,
                      height: "15vh",
                      margin: "5%",
                    }}
                  >
                    User 4
                  </Card>
                ) : (
                  <Card
                    style={{
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      color: "white",
                      fontFamily: "Ramche",
                    }}
                    sx={{
                      backgroundImage: `url("/images/ShotEmpty.jfif")`,
                      height: "15vh",
                      margin: "5%",
                      fontFamily: "Ramche",
                    }}
                  >
                    User 4
                  </Card>
                )}
              </Box>
              {/* 이미지 전환 버튼 */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
              >
                <Button variant="outlined" color="warning" onClick={handlePrev}>
                  <FaArrowLeft />
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => copyCapture(copyRef.current)}
                  style={{ fontFamily: "Ramche" }}
                >
                  확인
                </Button>

                <Button variant="outlined" color="warning" onClick={handleNext}>
                  <FaArrowRight />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        {/* <Button variant="contained" color="secondary" onClick={handleTestClose}>
          Test Close
        </Button> */}
      </Container>
      {/* '로그인 경고' 모달 */}
      <LoginAlert isOpen={isLoginAlertOpen} onClose={handleCloseLoginAlert} />
    </Box>
  );
};

// 인생네컷 저장 컴포넌트
// function copyCapture(element) {
//   if (element) {
//     domtoimage
//       .toPng(element)
//       .then(function (dataUrl) {
//         console.log(dataUrl);
//         const link = document.createElement("a");
//         link.download = "capture.png";
//         link.href = dataUrl;
//         link.click();
//       })
//       .catch(function (error) {
//         console.error("oops, something went wrong!", error);
//       });
//   }
// }

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
      .then(navigate("/"))
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }
}

function dataURLtoFile(dataURL, filename) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export default GameShot;
