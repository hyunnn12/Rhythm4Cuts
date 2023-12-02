import { removeCookie } from "../../utils/cookie";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useState } from "react";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import LogoutAlert from "../Common/LogoutAlert";
import MessageAlert from "../Common/MessageAlert";
import Badge from "@mui/material/Badge";
import axios from "axios";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import YourModalComponent from "../Common/ConfirmFriend";
import GameInviteModal from "../Common/InviteGameModal";

const HeaderWait = () => {
  const navigate = useNavigate();
  const access = getCookie("access");
  const {
    hasNotification,
    resetNotification,
    friendRequest,
    gameInvite,
    resetGameInvite,
  } = useWebSocket(); // Get the required states and functions from the hook
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // 모달 상태를 관리하기 위한 state 추가
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);

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
        navigate("/");
      } else {
        window.confirm("로그아웃 실패.");
      }
    } catch (error) {
      console.log(error);
      window.confirm("로그아웃 통신 오류발생.");
    }
  };

  const GoMain = () => {
    navigate("/");
  };

  const headerStyle = {
    height: "12vh",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const logoStyle = {
    height: "25vh",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const imgStyle = {
    height: "40%",
    color: "white",
  };

  const loginStyle = {
    marginRight: "5vw",
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
    fontFamily: "Ramche",
  };

  return (
    <div style={headerStyle}>
      <div style={logoStyle} onClick={GoMain}>
        <img
          src="images/GameImage/HeaderLogo.png"
          style={imgStyle}
          alt="Logo"
        ></img>
      </div>
      <div
        style={{
          fontFamily: "Ramche",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        <Badge
          color="error"
          variant={hasNotification || gameInvite ? "dot" : "standard"} // 게임 초대 알림 상태에 따라 dot 표시
          onClick={onNotificationClick}
          style={{ marginRight: "30px", cursor: "pointer" }}
        >
          <NotificationsIcon />
        </Badge>
        <Link style={loginStyle} onClick={() => setLogoutModalOpen(true)}>
          Logout
        </Link>
      </div>

      {/* 로그아웃 모달 */}
      <LogoutAlert
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={checkLogin}
      />

      {/* 알림 모달 */}
      <MessageAlert
        isOpen={isMessageModalOpen}
        onClose={() => setMessageModalOpen(false)}
      />


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
    </div>
  );
};

export default HeaderWait;
