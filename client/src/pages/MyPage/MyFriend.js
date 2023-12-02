// MyFriend.js
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userInfo } from "../../apis/userInfo";
import LoginMypageHeader from "../../components/Home/BlackHeader";
import MainContent from "../../components/My/My_MainContent";
import FriendInfo from "../../components/My/My_Friend"; // UserInfo 컴포넌트를 import
import Sidebar from "../../components/My/My_SideBar";
import React from "react";
import "./MyFriend.css";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import LoginAlert from "../../components/Common/LoginAlert";

const MyFriend = () => {
  const navigate = useNavigate();

  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기
  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false); // 로그인 알람

  useEffect(() => {
    connectWebSocket();
    console.log("WebSocket attempted to connect");
  }, []);

  try {
    userInfo()
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
        }
      })
      .catch((error) => {
        handleOpenLoginAlert();
      });
  } catch (error) {
    console.log(error);
  }

  // 로그인 상태를 업데이트하는 함수
  const handleOpenLoginAlert = () => {
    setLoginAlertOpen(true);
  };
  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false);
    navigate("/Login");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(to right, rgb(123,123,255), rgb(255,123,123))",
      }}
    >
      <LoginMypageHeader />
      <div className="page-container">
        <Sidebar></Sidebar>
        <div className="friend-container">
          <MainContent></MainContent>
          <FriendInfo></FriendInfo>
        </div>
      </div>
      {/* '로그인 경고' 모달 */}
      <LoginAlert isOpen={isLoginAlertOpen} onClose={handleCloseLoginAlert} />
    </div>
  );
};

export default MyFriend;
