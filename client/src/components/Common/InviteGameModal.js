import { Modal, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useNavigate } from "react-router-dom";

const GameInviteModal = ({ gameInvite, onClose }) => {
  const [fromUserName, setFromUserName] = useState("");
  const requestData = JSON.parse(gameInvite);
  const gameSeq = requestData.gameSeq;
  const navigate = useNavigate();

  useEffect(() => {
    // userSeq 값을 사용하여 닉네임을 가져오는 함수
    const getNickname = async userSeq => {
      try {
        const response = await axios.get(
          `https://i9b109.p.ssafy.io:8443/member/info/nickname/${userSeq}`,
          {
            headers: {
              Authorization: "Bearer " + getCookie("access"),
            },
          }
        );
        return response.data.data; // API 응답에서 닉네임을 반환
      } catch (error) {
        console.error("Failed to fetch nickname:", error);
        return "";
      }
    };

    // fromUser의 닉네임을 가져와 상태를 업데이트
    getNickname(requestData.fromUser).then(nickname =>
      setFromUserName(nickname)
    );
  }, [requestData.fromUser]);

  const message = `${fromUserName}님이 게임 초대를 보냈습니다.`;

  const acceptGameInvite = async () => {
    navigate(`/GameWait/${gameSeq}`); // <-- 여기에 페이지 이동 코드 추가
    onClose(); // 모달 닫기
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "30px",
          boxShadow: 3,
        }}
      >
        <p>{message}</p>
        <Button variant="contained" color="primary" onClick={acceptGameInvite}>
          수락
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          거절
        </Button>
      </Box>
    </Modal>
  );
};

export default GameInviteModal;
