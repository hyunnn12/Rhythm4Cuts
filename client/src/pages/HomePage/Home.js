// Home.js
//데이터가 들어오면 만들어야하는 애들 : 소개 영상, 음악 랭킹, 유저 랭킹, 일자별 방명록
import { React, useRef, useEffect, useState } from "react";
import { getCookie, removeCookie, setCookie } from "../../utils/cookie";
import { renewAccessToken } from "../../apis/renewAccessToken";
import { Grid, Pagination } from "@mui/material";
import { userInfo } from "../../apis/userInfo";
import DatePicker from "react-datepicker";
import MusicRank from "../../components/Home/MusicRank";
import UserRank from "../../components/Home/UserRank";
import WhiteHeader from "../../components/Home/WhiteHeader"; // 로그인 되어있을 때
import Header from "../../components/Home/Header";
import Dots from "../../components/Home/Dots";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "animate.css";
import "./Home.css";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";

const DIVIDER_HEIGHT = 5;

function Home() {
  //로그인 상태 저장변수
  const [isLogin, setIsLogin] = useState(false);

  //로그인 상태 확인 및 유저 정보 불러오는 부분
  try {
    userInfo()
      .then((res) => {
        console.log(res.data);
        setIsLogin(true);
      })
      .catch((error) => {
        setIsLogin(false);
        console.log(error);
        if (error.response.status !== 200) {
          console.log("accessToken이 만료되었습니다.");
          renewAccessToken()
            .then((res) => {
              setCookie("access", res.accessToken);
              console.log(res);
              console.log("accessToken 재발급 완료");
              window.location.reload();
            })
            .catch((error) => {
              console.log("refresh토큰이 에러");
              console.log(error);
              checkLogin();
            });
        }
      });
  } catch (error) {
    console.log(error);
  }

  //로그아웃 관련 코드
  const checkLogin = async () => {
    const access = getCookie("access");

    try {
      const response = await axios.post(
        "https://i9b109.p.ssafy.io:8443/member/logout",
        {
          email: getCookie("email"),
          accessToken: getCookie("access"),
        },
        {
          headers: {
            Authorization: "Bearer " + access,
          },
        }
      );
      if (response.status === 200) {
        console.log("로그아웃 성공");
        removeCookie("access");
        removeCookie("refresh");
        removeCookie("email");
        window.location.reload();
      } else {
        window.confirm("1오류가 발생했습니다.");
      }
    } catch (error) {}
  };

  const [startDate, setStartDate] = useState(new Date());
  const outerDivRef = useRef();
  const [scrollIndex, setScrollIndex] = useState(1);

  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기

  //음악 랭킹
  const [musicData, setMusicData] = useState([]);

  const fetchMusicRank = async () => {
    try {
      const response = await axios.get(
        "https://i9b109.p.ssafy.io:8443/ranking/song"
      );
      console.log(response.data.data);
      setMusicData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWebSocket();
    fetchMusicRank();
    fetchUserRank();
  }, []);

  // 음악 개수 컨트롤러
  const musicPerPage = 10; // 한 페이지당 표시할 방 수
  const [musicPage, setMusicPage] = useState(1); // 페이지 상태

  // 음악 페이지 변경 이벤트 핸들러
  const handleMusicChange = (event, value) => {
    setMusicPage(value);
  };

  // 음악 페이지 수 계산
  const noOfMusicPages = Math.ceil(musicData.length / musicPerPage);

  //유저 랭킹
  const [userData, setUserData] = useState([]);

  const fetchUserRank = async () => {
    try {
      const response = await axios.get(
        "https://i9b109.p.ssafy.io:8443/ranking/user"
      );
      console.log(response.data.data);
      setUserData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 유저 개수 컨트롤러
  const userPerPage = 7; // 한 페이지당 표시할 방 수
  const [userPage, setUserPage] = useState(1); // 페이지 상태

  // 유저페이지 변경 이벤트 핸들러
  const handleUserChange = (event, value) => {
    setUserPage(value);
  };

  // 유저 페이지 수 계산
  const noOfUserPages = Math.ceil(userData.length / userPerPage);

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current; // 스크롤 위쪽 끝부분 위치
      const pageHeight = window.innerHeight; // 화면 세로길이, 100vh와 같습니다.

      if (deltaY > 0) {
        // 스크롤 내릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(2);
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(3);
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 3) {
          outerDivRef.current.scrollTo({
            top: pageHeight * 2,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(3);
        }
        // else {
        //   outerDivRef.current.scrollTo({
        //     top: pageHeight * 4 + DIVIDER_HEIGHT * 4,
        //     left: 0,
        //     behavior: "smooth",
        //   });
        //   setScrollIndex(4);
        // }
      } else {
        // 스크롤 올릴 때
        if (scrollTop >= 0 && scrollTop < pageHeight) {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(1);
        } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
          outerDivRef.current.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(1);
        } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
          outerDivRef.current.scrollTo({
            top: pageHeight + DIVIDER_HEIGHT,
            left: 0,
            behavior: "smooth",
          });
          setScrollIndex(2);
        }
        // else {
        //   outerDivRef.current.scrollTo({
        //     top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
        //     left: 0,
        //     behavior: "smooth",
        //   });
        //   setScrollIndex(3);
        // }
      }
    };
    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  return (
    <div className="background">
      <div className="background-image"></div>
      <div ref={outerDivRef} className="outer">
        <Dots scrollIndex={scrollIndex} />
        {/** Home 1 시작하는 곳 */}
        <div className="Home1">
          {isLogin ? <WhiteHeader /> : <Header />}

          <div className="main1">
            <div className="beatbox">
              <div className="Logo">
                <a href="/GameList">
                  <img
                    className="img"
                    alt="Home_Effect2"
                    src="images/dddd.png"
                  ></img>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/** Home 2 시작하는 곳 */}
        <div className="Home2">
          <div className="title">
            <span style={{ marginRight: "150px" }}>
              Game Intro&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <span>Rules&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
          <div className="content">
            <div className="intro">
              {/* <iframe
                width="672"
                height="378"
                src="https://www.youtube.com/embed/ZZlMB-qRQv0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe> */}
              <div style={{ width: "672px", height: "378px" }}>
                <video
                  controls={true}
                  loop
                  // muted
                  style={{ width: "672px", height: "378px" }}
                >
                  <source src="/videos/제출예비.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <div className="rules">
              <img
                alt="게임 규칙 이미지"
                style={{ height: 500, width: 530 }}
                src="images/removeRules.png"
              />
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/** Home 3 시작하는 곳 */}
        <div className="Home3">
          <div className="content">
            <div className="rank1">
              <h1>Music Rank</h1>
              <div className="rt_sing_rank">
                <div>
                  <div className="category">
                    <Grid container textAlign="center">
                      <Grid item xs={2}>
                        순위
                      </Grid>
                      <Grid item xs={6}>
                        제목
                      </Grid>
                      <Grid item xs={4}>
                        가수
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div className="music_rank">
                  <div className="rank" style={{ padding: "10px" }}>
                    {musicData
                      .slice(
                        (musicPage - 1) * musicPerPage,
                        musicPage * musicPerPage
                      )
                      .map((music, index) => (
                        <MusicRank key={index} music={music} />
                      ))}
                  </div>
                </div>
                <Pagination
                  count={noOfMusicPages}
                  page={musicPage}
                  onChange={handleMusicChange}
                  color="primary"
                  size="large"
                  shape="rounded"
                  sx={{
                    padding: "3%",
                    display: "flex",
                    justifyContent: "center",
                    "& .MuiPaginationItem-root": {
                      color: "white", // 기본 아이템 색상을 흰색으로 설정
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // 기본 아이템의 배경색을 약간 투명한 검정색으로 설정
                    },
                    "& .MuiPaginationItem-page.Mui-selected": {
                      backgroundColor: "#14006d", // 선택된 아이템의 배경색을 파란색으로 설정
                      opacity: 0.8,

                      color: "white", // 선택된 아이템의 텍스트 색상을 흰색으로 설정
                    },
                    "& .MuiPaginationItem-page:hover": {
                      backgroundColor: "#7f62ff", // 마우스 호버 시 아이템의 배경색을 진한 파란색으로 설정
                    },
                  }}
                />
              </div>
            </div>
            <div className="rank2">
              <h1>Total Rank</h1>
              <div className="total_rank">
                <div className="nickname">
                  {userData.length > 0 ? (
                    <div>
                      <span>{userData[1].nickname}</span>
                      <span>{userData[0].nickname}</span>
                      <span>{userData[2].nickname}</span>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="top100">
                <div style={{ height: "20%" }}>
                  <div className="category">
                    <Grid container textAlign="center">
                      <Grid item xs={3.25}>
                        순위
                      </Grid>
                      <Grid item xs={5.5}>
                        닉네임
                      </Grid>
                      <Grid item xs={3.25}>
                        점수
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div className="user_rank">
                  <div className="rank">
                    {userData
                      .slice(
                        (userPage - 1) * userPerPage,
                        userPage * userPerPage
                      )
                      .map((user, index) => (
                        <UserRank key={index} user={user} index={index} />
                      ))}
                  </div>
                </div>
              </div>
              <Pagination
                count={noOfUserPages}
                page={userPage}
                onChange={handleUserChange}
                color="primary"
                size="large"
                shape="rounded"
                sx={{
                  padding: "3%",
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiPaginationItem-root": {
                    color: "white", // 기본 아이템 색상을 흰색으로 설정
                    backgroundColor: "rgba(0, 0, 0, 0.1)", // 기본 아이템의 배경색을 약간 투명한 검정색으로 설정
                  },
                  "& .MuiPaginationItem-page.Mui-selected": {
                    opacity: 0.8,
                    backgroundColor: "#14006d", // 선택된 아이템의 배경색을 파란색으로 설정
                    color: "white", // 선택된 아이템의 텍스트 색상을 흰색으로 설정
                  },
                  "& .MuiPaginationItem-page:hover": {
                    backgroundColor: "#7f62ff", // 마우스 호버 시 아이템의 배경색을 진한 파란색으로 설정
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className="divider"></div>
        {/* * Home 4 시작하는 곳
        <div className="Home4">
          <div className="sideBar">
            <div className="calender">
              <div className="title">
                <span>Today 방명록</span>
              </div>
              <DatePicker
                className="datePicker"
                dateFormat="yyyy.MM.dd" // 날짜 형태
                shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
          </div>
          <div className="content">
            <div className="line1">
              <div className="picture"></div>
              <div className="picture"></div>
              <div className="picture"></div>
              <div className="picture"></div>
            </div>
            <div className="line2">
              <div className="picture"></div>
              <div className="picture"></div>
              <div className="picture"></div>
              <div className="picture"></div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
