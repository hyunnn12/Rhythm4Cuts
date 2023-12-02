import { removeCookie } from "../../utils/cookie";
import "./BlackHeader.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import axios from "axios";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import { useState } from "react";
import YourModalComponent from "../Common/ConfirmFriend";
import GameInviteModal from "../Common/InviteGameModal";
import MessageAlert from '../Common/MessageAlert';

const LoginMypageHeader = () => {
  const navigate = useNavigate();
  const access = getCookie("access");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const {
    hasNotification,
    resetNotification,
    friendRequest,
    gameInvite,
    resetGameInvite,
  } = useWebSocket(); // 여기서 friendRequest 가져옴

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
      window.confirm("2오류가 발생했습니다.");
    }
  };

  const GoMain = () => {
    navigate("/");
  };

  return (
    <div className="Header_outer2">
      <div className="Header_logo2" onClick={GoMain} style={{ cursor: "pointer" }}>
        <img src="images/Mypage_Logo.png" alt="헤더 사진" />
      </div>
      <div>
        <Badge
          color="error"
          variant={hasNotification || gameInvite ? "dot" : "standard"}
          onClick={onNotificationClick}
          style={{ marginRight: "20px", fontFamily: 'Ramche', cursor: "pointer"}}
        >
          <NotificationsIcon />
        </Badge>
        <Link className="Header_Login2" to="/" onClick={checkLogin} style={{ fontFamily: 'Ramche', }}>
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

export default LoginMypageHeader;
