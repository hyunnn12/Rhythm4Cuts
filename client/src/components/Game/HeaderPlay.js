import NotificationsIcon from "@mui/icons-material/NotificationsNone";
import Badge from "@mui/material/Badge";
import { useWebSocket } from "../../utils/WebSocket/WebSocket"; // Import the useWebSocket hook
import { useState } from "react";
import YourModalComponent from "../Common/ConfirmFriend";
import MessageAlert from "../Common/MessageAlert";

function LoginMypageHeader() {
  const { hasNotification, resetNotification, friendRequest } = useWebSocket(); // Get the required states and functions from the hook
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);


  const onNotificationClick = () => {
    if (!hasNotification) {
      setMessageModalOpen(true);
      // window.alert("알림이 없습니다!"); // 알림 상태가 false일 때 메시지 표시
    } else {
      resetNotification();
      setIsModalOpen(true); // 모달 열기
    }
  };
  // 모든 요소에 직접 color 속성 추가
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
  };

  const imgStyle = {
    height: "40%",
    color: "white",
  };

  return (
    <div style={headerStyle}>
      <div style={logoStyle}>
        <img
          src="/images/GameImage/HeaderLogo.png"
          style={imgStyle}
          alt="Logo"
        ></img>
      </div>
      <div>
        <Badge
          color="error"
          variant={hasNotification ? "dot" : "standard"} // Set the variant conditionally based on the hasNotification state
          onClick={onNotificationClick} // Set the onClick handler
          style={{ marginRight: "50px", fontFamily: 'Ramche', }}
        >
          <NotificationsIcon />
        </Badge>
      </div>

      {/* Friend request modal */}
      {isModalOpen && friendRequest && (
        <YourModalComponent
          friendRequest={friendRequest}
          onClose={() => setIsModalOpen(false)}
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
