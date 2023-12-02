/*eslint-disable*/
import { Grid, Pagination, Box, Button, Paper, TextField, IconButton, Select, MenuItem } from "@mui/material";
import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { setNickname } from "../../store";
import { getCookie } from "../../utils/cookie";
import { userInfo } from "../../apis/userInfo";
import CreateRoom from "../../components/Common/CreateRoom";
import LoginAlert from "../../components/Common/LoginAlert";
import FriendList from "../../components/Game/FriendList";
import AddFriend from "../../components/Common/AddFriend";
import RefreshIcon from "@mui/icons-material/Refresh";
import RoomList from "../../components/Game/RoomList";
import Header from "../../components/Game/HeaderWait";
import axios from "axios";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";

function GameList() {
  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기
  const dispatch = useDispatch(); // 리덕스 업데이트
  const navigate = useNavigate();
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false); //  '방 만들기' 모달의 상태를 관리
  const [searchCategory, setSearchCategory] = useState("gameSeq"); //  검색 카테고리 상태 (기본값을 'gameSeq'로 설정)
  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false); // 로그인 알람
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [rooms, setRooms] = useState([]); // 방 리스트 (초기값 빈 배열로 설정)
  const [page, setPage] = useState(1); // 페이지 상태
  const itemsPerPage = 6; // 한 페이지당 표시할 방 수
  const [userSeq, setUserSeq] = useState(""); // 유저시퀀스
  const [refreshCounter, setRefreshCounter] = useState(0); // 새로고침 카운터 추가

  // 친구 추가
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false);

  // '친구 추가' 상태를 업데이트하는 함수
  const handleOpenAddFriendModal = () => {
    setAddFriendModalOpen(true);
  };
  const handleCloseAddFriendModal = () => {
    setAddFriendModalOpen(false);
  };

  // 방만들기 상태를 업데이트하는 함수
  const handleOpenCreateRoomModal = () => {
    setCreateRoomModalOpen(true);
  };
  const handleCloseCreateRoomModal = () => {
    setCreateRoomModalOpen(false);
  };

  // 로그인 상태를 업데이트하는 함수
  const handleOpenLoginAlert = () => {
    setLoginAlertOpen(true);
  };
  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false);
    navigate("/Login");
  };

  // 로그인 상태관리
  useEffect(() => {
    connectWebSocket();
    userInfo()
      .then(res => {
        if (res.status === 200) {
          setUserSeq(res.data.user_seq);
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

  // 서버에서 방 리스트 가져오기
  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://i9b109.p.ssafy.io:8443/lobby/list",
        {
          headers: {
            Authorization: "Bearer " + getCookie("access"),
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("방 리스트 가져오는데 실패 뽝!! : ", error);
      return [];
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    };
    getRooms();
  }, []);

  // 새로고침 버튼 클릭 시 방 목록 갱신
  const handleRefresh = async () => {
    const roomsData = await fetchRooms();
    setRooms(roomsData);
    setRefreshCounter(prevCounter => prevCounter + 1); // 새로고침 카운터 증가
  };

  // 검색어에 따라 방 리스트 필터링
  let filteredRooms = rooms.filter(room => {
    switch (searchCategory) {
      case "gameSeq":
        return room.gameSeq
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // 방 번호를 문자열로 변환한 후 검색어를 포함하는지 확인
      case "title":
        return room.title.toLowerCase().includes(searchTerm.toLowerCase()); // 방 제목이 검색어를 포함하는지 확인
      case "songSeq":
        return room.songSeq
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()); // 노래 번호를 문자열로 변환한 후 검색어를 포함하는지 확인
      default:
        return true; // 검색 카테고리가 설정되지 않은 경우, 모든 방을 표시
    }
  });

  // 필터링된 방 리스트를 통해 페이지 수 계산
  const noOfPages = Math.ceil(filteredRooms.length / itemsPerPage);
  // 페이지 변경 이벤트 핸들러
  const handleChange = (event, value) => {
    setPage(value);
  };
  // 검색어 변경 이벤트 핸들러
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  // 유저 닉네임 가져오기 : 리덕스 저장 => 나중에 로그인 페이지에서 처리
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const email = getCookie("email");
        const access = getCookie("access");
        const response = await axios.get(
          "https://i9b109.p.ssafy.io:8443/member/info?email=" + email,
          {
            headers: {
              Authorization: "Bearer " + access,
            },
          }
        );
        dispatch(setNickname(response.data.nickname));
      } catch (error) {
        console.log("닉네임 가져오는데 오류가 발생했어요~");
      }
    };
    fetchNickname();
  }, []);

  // 빠른 입장 버튼을 클릭했을 때 실행되는 함수
  const handleQuickJoin = async () => {
    // 현재 입장 가능한 방 중에서 조건에 맞는 방을 찾아 입장
    const joinableRooms = filteredRooms.filter(
      room => room.headcount >= 1 && room.headcount <= 3 && !room.isSecret
    );

    if (joinableRooms.length > 0) {
      try {
        // 여기에 입장 로직을 작성
        // 입장 요청이 성공하면 게임 대기실 페이지로 이동
        navigate(`/GameWait/${joinableRooms[0].gameSeq}`);
      } catch (error) {
        console.error("방 입장 중 오류 발생:", error);
      }
    } else {
      console.log("입장할 수 있는 방이 없습니다.");
      // 예: 알림 메시지 표시 등의 처리
    }
  };

  // 방 입장
  const handleOpenGameWait = room => {
    navigate(`/GameWait/${room.gameSeq}`, {
      state: { data: room.songSeq },
    });
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
      <Grid container>
        {/* Left */}
        <Grid item xs={9} padding={"20px"}>
          {/* Left : Top */}
          <Box display="flex" justifyContent="flex-end" marginBottom="1%">
            {/* 새로고침 아이콘 */}
            <IconButton
              onClick={handleRefresh}
              style={{
                marginBottom: "0.5em",
              }}
            >
              <RefreshIcon style={{ color: "#ffffff", fontFamily: "Ramche" }} />
            </IconButton>

            {/* 검색 카테고리 추가 */}
            <Select
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              style={{
                backgroundColor: "rgba(0, 128, 255, 0.1)",
                marginRight: "1em",
                marginBottom: "0.5em",
                color: "#ffffff",
                borderColor: "#ffffff", // 테두리 색상을 흰색으로 설정
                height: "7vh",
                fontFamily: "Ramche",
              }}
              // 검색 카테고리의 드롭다운 메뉴 스타일 변경
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: "#333", // 드롭다운 메뉴 배경색 변경
                    color: "#ffffff", // 드롭다운 메뉴 텍스트 색상 변경
                    border: "1px solid #ffffff", // 드롭다운 메뉴 테두리 색상을 흰색으로 설정
                    fontFamily: "Ramche",
                  },
                },
              }}
            >
              <MenuItem value={"gameSeq"} style={{ fontFamily: "Ramche" }}>방 번호</MenuItem>
              <MenuItem value={"title"} style={{ fontFamily: "Ramche" }}>방 이름</MenuItem>
              <MenuItem value={"songSeq"} style={{ fontFamily: "Ramche" }}>노래 제목</MenuItem>
            </Select>

            <TextField
              label="검색"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                marginRight: "1em",
                backgroundColor: "rgba(0, 128, 255, 0.1)",
                height: "7vh",
                fontFamily: "Ramche",
              }}
              InputProps={{
                style: {
                  color: "#ffffff",
                  height: "7vh",
                  fontSize: "20px",
                  fontFamily: "Ramche",
                },
                inputProps: {
                  style: { color: "#ffffff", fontFamily: "Ramche" },
                },
              }}
              InputLabelProps={{
                style: {
                  color: "#ffffff",
                  fontFamily: "Ramche",
                },
              }}
            />
            <Button
              style={{
                height: "7vh",
                width: "20%",
                marginBottom: "0.5em",
                marginRight: "0.5em",
                backgroundColor: "rgba(0, 128, 255, 0.3)",
                fontWeight: "bold",
                fontSize: "20px",
                fontFamily: "Ramche",
              }}
              variant="contained"
              onClick={handleOpenCreateRoomModal}
            >
              방 만들기
            </Button>
            <Button
              style={{
                height: "7vh",
                width: "20%",
                marginBottom: "0.5em",
                marginRight: "0.5em",
                backgroundColor: "rgba(0, 128, 255, 0.3)",
                fontWeight: "bold",
                fontSize: "20px",
                fontFamily: "Ramche",
              }}
              variant="contained"
              onClick={handleQuickJoin}
            >
              빠른 입장
            </Button>
          </Box>

          {/* Left : Middle */}
          <Grid container spacing={2}>
            {filteredRooms
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((room, gameSeq) => (
                <Grid item xs={6} key={gameSeq}>
                  {/* 방 누르면 입장 */}
                  <Button>
                    <RoomList
                      key={gameSeq}
                      room={room}
                      onRoomClick={handleOpenGameWait}
                    />
                  </Button>
                </Grid>
              ))}

            {/* Left : Bottom */}
            <Paper
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1%",
                backgroundColor: "rgba(0, 0, 0, 0.8)", // 배경색을 검정색으로 변경
                marginTop: "1%",
                width: "100%", // 너비를 100%로 설정
                height: "5vh",
                fontFamily: "Ramche",
              }}
            >
              <Pagination
                count={noOfPages}
                page={page}
                onChange={handleChange}
                color="primary"
                size="large"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#ffffff", // 아이템 색상을 흰색으로 설정
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // 아이템의 배경색을 약간 투명한 흰색으로 설정
                  },
                  "& .MuiPaginationItem-page.Mui-selected": {
                    backgroundColor: "#3f51b5", // 선택된 아이템의 배경색을 파란색으로 설정
                    color: "#ffffff", // 선택된 아이템의 텍스트 색상을 흰색으로 설정
                  },
                  "& .MuiPaginationItem-page:hover": {
                    backgroundColor: "#283593", // 마우스 호버 시 아이템의 배경색을 진한 파란색으로 설정
                  },
                }}
                style={{ fontFamily: "Ramche" }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Right */}
        <Grid item xs={3} padding={"15px"}>
          <Paper
            elevation={10}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              height: "81vh",
              fontFamily: "Ramche",
            }}
          >
            <Box padding={"20px"}>
              <Grid direction="column" container>
                <Grid item xs={12}>
                  <h2
                    style={{
                      color: "#ffffff",
                      textAlign: "center",
                      fontFamily: "Pretendard-Regular",
                      fontWeight: "bold",
                      fontSize: "25px",
                      fontFamily: "Ramche",
                    }}
                  >
                    친구 목록
                  </h2>

                  <Box
                    style={{
                      margin: "40px",
                      display: "flex",
                      justifyContent: "center",
                      height: "50vh",
                      overflow: "auto",
                      fontFamily: "Ramche",
                    }}
                  >
                    <FriendList userSeq={userSeq} refreshCounter={refreshCounter} />
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="right"
                    padding={"10px"}
                    marginRight={"25px"}
                  >
                    <Button
                      variant="contained"
                      onClick={handleOpenAddFriendModal}
                      style={{
                        borderRadius: "30px",
                        backgroundColor: "rgba(0, 128, 255, 0.3)",
                        width: "30%",
                        height: "5vh",
                        fontSize: "15px",
                        fontFamily: "Ramche",
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* '방 만들기' 모달 */}
      <CreateRoom
        isOpen={isCreateRoomModalOpen}
        handleClose={handleCloseCreateRoomModal}
      />

      {/* '친구 추가' 모달 */}
      <AddFriend
        isOpen={isAddFriendModalOpen}
        handleClose={handleCloseAddFriendModal}
      />

      {/* '로그인 경고' 모달 */}
      <LoginAlert isOpen={isLoginAlertOpen} onClose={handleCloseLoginAlert} />
    </div>
  );
}

export default GameList;
