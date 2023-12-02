// 지금 페이지의 이름을 그 페이지의 제목처럼 표시해줄 컴포넌트
import { useLocation } from "react-router-dom";
import { useState } from "react";
import AddFriend from "../Common/AddFriend";
import React from "react";
import "./My_MainContent.css";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import { useEffect } from "react";

function MainContent() {
  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기

  useEffect(() => {
    // connectWebSocket();
    console.log("WebSocket attempted to connect");
  }, []);
  const location = useLocation();

  // 친구 추가
  const [isAddFriendModalOpen, setAddFriendModalOpen] = useState(false); // '친구 추가' 모달의 상태를 관리
  // '친구 추가' 모달 상태를 업데이트하는 함수
  const handleOpenAddFriendModal = () => {
    setAddFriendModalOpen(true);
  };

  const handleCloseAddFriendModal = () => {
    setAddFriendModalOpen(false);
  };
  // 페이지 제목 설정
  const pageTitles = {
    "/Mypage": "가입 정보",
    "/MyFriend": "친구 정보",
    "/MyPoint": "Point 정보",
    "/MyPhoto": "My Photo",
    "/MyModify": "정보 수정",
  };

  const title = pageTitles[location.pathname];
  const isMyFriendPage = location.pathname === "/MyFriend";

  return (
    <div
      className={
        isMyFriendPage ? "main-content my-friend-page" : "main-content"
      }
    >
      <h1
        style={{
          fontFamily: 'Ramche',
          fontWeight: "bold",
          color: "white",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

export default MainContent;
