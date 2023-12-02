import React, { createContext, useContext, useState, useCallback } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { userInfo } from "../../apis/userInfo";

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasNotification, setHasNotification] = useState(false); // 알림 상태 추가
  const [friendRequest, setFriendRequest] = useState(null); // 친구 요청 정보 저장
  const [videoVisible, setVideoVisible] = useState(false);
  const [gameInvite, setGameInvite] = useState(null); // 게임 초대 알림 정보를 저장할 상태

  let socket = null;
  let reconnectInterval;

  const connectWebSocket = useCallback(gameSeq => {
    if (socket && socket.connected) {
      console.log("WebSocket is already connected");
    } else {
      console.log("Attempting to connect to WebSocket");
      // ... (이후의 연결 코드)
    }

    if (!socket || !socket.connected) {
      // 먼저 사용자 정보를 가져옵니다.
      userInfo()
        .then(res => {
          // console.log(res.data.user_seq);
          // 사용자 정보가 존재하면 웹소켓을 연결합니다.
          if (res.data.user_seq !== null) {
            socket = new SockJS("https://i9b109.p.ssafy.io:8443/stomp/chat");
            const stomp = Stomp.over(socket);
            console.log(res.data.user_seq + "연결 후");
            socket.onclose = () => {
              console.error("웹소켓 연결이 끊어졌습니다. 재연결을 시도합니다.");
              if (!reconnectInterval) {
                reconnectInterval = setInterval(connectWebSocket, 2000);
              }
            };

            stomp.connect({}, () => {
              console.log("전역 설정");
              if (reconnectInterval) {
                clearInterval(reconnectInterval);
                reconnectInterval = null;
              }
              const fromUser = res.data.user_seq;
              if (fromUser) {
                stomp.subscribe(`/subscribe/friend/${fromUser}`, message => {
                  setMessages(prev => [...prev, message.body]);
                  setHasNotification(true);
                  setFriendRequest(message.body); // 여기서 메시지 내용 저장
                });
                // stomp.subscribe(`/subscribe/game/${fromUser}`, message => {
                //   setMessages(prev => [...prev, message.body]);
                //   setHasNotification(true); // 알림 상태 업데이트
                // });
                stomp.subscribe(`/subscribe/song/${gameSeq}`, message => {
                  setVideoVisible(true);
                  window.alert("영상 다같이 시작할게");
                });
                stomp.subscribe(
                  `/subscribe/friend/invite/${fromUser}`,
                  message => {
                    // alert("게임 초대 요청 옴");
                    setGameInvite(message.body); // 게임 초대 메시지 내용 저장
                  }
                );
                if (fromUser) {
                  console.log("전역 웹소캣 연결 확인");
                  stomp.subscribe(
                    `/subscribe/friend/invite/${fromUser}`,
                    () => {}
                  );
                }
              }
            });

            setConnected(true);
          } else {
            console.warn("로그인된 사용자 정보가 없습니다.");
          }
        })
        .catch(error => {
          console.error("Failed to fetch user info:", error);
        });
    }
  }, []);

  // 노래 시작 함수
  const sendGameStartMessage = gameSeq => {
    console.log(gameSeq + "웹소켓 연결 페이지에서");
    if (socket && socket.connected) {
      const stomp = Stomp.over(socket);
      // gameSeq 값을 포함하여 서버에 메시지 전송
      const message = {
        gameSeq: gameSeq,
      };
      stomp.send("/public/song", {}, JSON.stringify(message));
    }
  };

  const resetGameInvite = () => {
    // 게임 초대 알림 상태를 초기화하는 함수
    setGameInvite(null);
  };
  const resetNotification = () => {
    // 알림 초기화 함수
    setHasNotification(false);
  };

  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
      setConnected(false);
    }
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  }, []);

  const contextValue = {
    connected,
    messages,
    connectWebSocket,
    disconnectWebSocket,
    hasNotification, // 알림 상태
    resetNotification, // 알림 초기화 함수
    friendRequest,
    sendGameStartMessage, // 추가
    gameInvite, // 게임 초대 알림 상태
    resetGameInvite, // 게임 초대 알림 상태 초기화 함수
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}
