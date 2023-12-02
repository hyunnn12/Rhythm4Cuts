import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import "./WhiteHeader.css";
import { Link } from "react-router-dom";
import { getCookie, removeCookie } from "../../utils/cookie";
import { useState } from "react";
import { userInfo } from "../../apis/userInfo";
import axios from "axios";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import YourModalComponent from "../Common/ConfirmFriend";
import GameInviteModal from "../Common/InviteGameModal";
import MessageAlert from '../Common/MessageAlert';

const LoginHeader = () => {
  const access = getCookie("access");
  const {
    hasNotification,
    resetNotification,
    friendRequest,
    gameInvite,
    resetGameInvite,
  } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);

  const onNotificationClick = () => {
    if (!hasNotification && !gameInvite) {
      setMessageModalOpen(true);
      // window.alert("알림이 없습니다!");
    } else {
      if (isModalOpen) {
        // 모달이 이미 열려있는 상태라면 모달을 닫고 알림 상태를 초기화합니다.
        setIsModalOpen(false);
        resetGameInvite();
        resetNotification();
      } else {
        // 모달이 닫혀있는 상태라면 모달을 엽니다.
        setIsModalOpen(true);
      }
    }
  };

  const checkLogin = async () => {
    try {
      const response = await axios.post(
        "https://i9b109.p.ssafy.io:8443/member/logout",
        {
          email: getCookie("email"),
          accessToken: access,
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
    } catch (error) {
      console.log(error);
      window.confirm("로그아웃오류가 발생했습니다.");
    }
  };

  const [nickName, setNickName] = useState("");
  const [point, setPoint] = useState(0);
  userInfo().then(res => {
    setNickName(res.data.nickname);
    setPoint(res.data.point);
  });
  return (
    <div className="Header_outer1" style={{ color: "white", fontFamily: 'Ramche', }}>
      <div className="Header_logo1" style={{ cursor: "pointer" }} >
        <img src="images/Home_Logo.png" alt="헤더 사진"></img>
      </div>
      <div>
        <span style={{ color: "white", marginRight: 20, fontWeight: "bold", fontFamily: 'Ramche', }}>
          {nickName}님 반갑습니다.
        </span>
        <span style={{ color: "white", marginRight: 20, fontWeight: "bold", fontFamily: 'Ramche', }}>
          {point}point
        </span>
        <Badge
          color="error"
          variant={hasNotification || gameInvite ? "dot" : "standard"}
          onClick={onNotificationClick}
          style={{ marginRight: "20px", cursor: "pointer" }}
        >
          <NotificationsIcon />
        </Badge>
        <Link className="Header_Login1" to="/Mypage" style={{ fontFamily: 'Ramche', }}>
          MyPage
        </Link>
        <Link className="Header_Login1" onClick={checkLogin} style={{ fontFamily: 'Ramche', }}>
          Logout
        </Link>
      </div>
      {/* Friend request modal */}
      {isModalOpen && hasNotification && (
        <YourModalComponent
          friendRequest={friendRequest}
          onClose={() => {
            setIsModalOpen(false);
            resetNotification();
          }}
        />
      )}

      {/* 게임 초대 요청 모달 */}
      {isModalOpen && gameInvite && (
        <GameInviteModal
          gameInvite={gameInvite}
          onClose={() => {
            setIsModalOpen(false);
            resetGameInvite();
          }}
        />
      )}

      {/* 알림 모달 */}
      <MessageAlert
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
      />
    </div>
  );
};

export default LoginHeader;
