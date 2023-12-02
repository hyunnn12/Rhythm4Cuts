import { Modal, List, ListItem, ListItemText, Button } from "@mui/material";
import { Stomp } from "@stomp/stompjs";
import { useState } from "react";
import SockJS from "sockjs-client";
import { userInfo } from "../../apis/userInfo";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

var sock = new SockJS("https://i9b109.p.ssafy.io:8443/stomp/chat");
var stomp = Stomp.over(sock);

function InviteFriendsModal({ isOpen, onClose, friends }) {
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const { gameSeq } = useParams(); // 여기서 gameSeq를 가져옴

  try {
    userInfo()
      .then(res => {
        if (res.status === 200) {
          setFromUser(res.data.user_seq);
          console.log(res.data.user_seq);
        }
      })
      .catch(error => {});
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    stomp.connect({}, () => {
      if (fromUser) {
        stomp.subscribe(`/subscribe/friend/invite/${fromUser}`, () => {});
      }
    });
  }, [fromUser]);

  function requestInvite() {
    var request = {
      fromUser: fromUser,
      toUser: toUser,
      gameSeq: gameSeq,
    };
    if (stomp.connected) {
      stomp.send("/public/invite", {}, JSON.stringify(request));
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div
        style={{
          width: "300px",
          margin: "100px auto",
          padding: "20px",
          backgroundColor: "#fff",
          fontFamily: 'Ramche',
        }}
      >
        <h3 style={{fontFamily: 'Ramche',}}>친구 초대하기</h3>
        <List>
          {friends.map(friend => (
            <ListItem key={friend.email}>
              <ListItemText
                primary={friend.nickname}
                secondary={friend.email}
              />
              <Button onClick={requestInvite}>초대</Button>
            </ListItem>
          ))}
        </List>
      </div>
    </Modal>
  );
}

// 여기서 'inviteFriend' 함수는 친구를 초대하는 로직을 수행해야 합니다.
