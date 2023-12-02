import { Modal, Button, Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

const YourModalComponent = ({ friendRequest, onClose }) => {
  const [fromUserName, setFromUserName] = useState("");
  const [friendList, setFriendList] = useState([]);
  const requestData = JSON.parse(friendRequest);

  useEffect(() => {
    // 친구 목록을 가져오는 함수
    const fetchFriendList = async () => {
      try {
        const response = await axios.get(
          `https://i9b109.p.ssafy.io:8443/friend/list/${requestData.toUser}`,
          {
            headers: {
              Authorization: "Bearer " + getCookie("access"),
            },
          }
        );

        if (response.data.statusCode === 200) {
          setFriendList(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch friend list:", error);
      }
    };

    fetchFriendList();
  }, [requestData.toUser]);

  useEffect(() => {
    // userSeq 값을 사용하여 닉네임을 가져오는 함수
    const getNickname = async (userSeq) => {
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

    // fromUser와 toUser의 닉네임을 가져와 상태를 업데이트
    getNickname(requestData.fromUser).then((nickname) =>
      setFromUserName(nickname)
    );
  }, [requestData.fromUser]);

  const message = `${fromUserName}님이 친구 요청을 보냈습니다.`;

  const acceptFriendRequest = async () => {
    // 이미 친구 상태인지 확인
    const isAlreadyFriend = friendList.some(
      (friend) => friend.userSeq === requestData.fromUser
    );

    if (isAlreadyFriend) {
      window.alert("이미 친구 상태입니다!");
      onClose(); // 모달 닫기
      return;
    }
    try {
      const response = await axios.post(
        "https://i9b109.p.ssafy.io:8443/friend/confirm",
        {
          fromUser: requestData.fromUser,
          toUser: requestData.toUser,
        },
        {
          headers: {
            Authorization: "Bearer " + getCookie("access"),
          },
        }
      );

      if (response.data.statusCode === 200) {
        console.log("친구 요청 수락 성공");
        window.alert("친구 수락이 완료되었습니다!");
        onClose(); // 모달 닫기
      } else {
        console.warn("친구 요청 수락에 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("친구 요청 수락 중 오류 발생:", error);
    }
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
          fontFamily: 'Ramche',
        }}
      >
        <p style={{fontFamily: 'Ramche',}}>{message}</p>
        <Button
          variant="contained"
          color="primary"
          onClick={acceptFriendRequest}
          style={{fontFamily: 'Ramche',}}
        >
          {" "}
          {/* 여기에 클릭 이벤트 핸들러 추가 */}
          수락
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose} style={{fontFamily: 'Ramche',}}>
          거절
        </Button>
      </Box>
    </Modal>
  );
};

export default YourModalComponent;
