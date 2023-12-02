import { React, useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useDebounce } from "use-debounce";
import { getCookie } from "../../utils/cookie";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../../apis/userInfo";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useWebSocket } from "../../utils/WebSocket/WebSocket";

var sock = new SockJS("https://i9b109.p.ssafy.io:8443/stomp/chat");
var stomp = Stomp.over(sock);

function AddFriend({ isOpen, handleClose }) {
  const [friendNickname, setfriendNickname] = useState("");
  const [UserInfo, setUserInfo] = useState({ nickname: "", email: "" });
  const [debouncedFriendNickname] = useDebounce(friendNickname, 300);
  const [fromUser, setFromUser] = useState("");
  const [toUser, setToUser] = useState("");
  const navigate = useNavigate();
  const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  try {
    userInfo()
      .then(res => {
        if (res.status === 200) {
          setFromUser(res.data.user_seq);
          console.log(res.data.user_seq);
        }
      })
      .catch(error => { });
  } catch (error) {
    console.log(error);
  }

  useEffect(() => {
    stomp.connect({}, () => {
      if (fromUser) {
        console.log("Subscribing to user:", fromUser);
        stomp.subscribe(`/subscribe/friend/${fromUser}`, () => {
          // alert("친구 요청 옴");
        });
      }
    });
  }, [fromUser]);

  useEffect(() => {
    // connectWebSocket();

    if (debouncedFriendNickname) {
      axios
        .get(
          `https://i9b109.p.ssafy.io:8443/friend/search/${debouncedFriendNickname}`,
          {
            headers: {
              Authorization: "Bearer " + getCookie("access"),
            },
          }
        )
        .then(response => {
          if (response.data.data.length > 0) {
            const { nickname, email, userSeq } = response.data.data[0];
            setUserInfo({ nickname, email });
            setToUser(userSeq);
          } else {
            setUserInfo({ nickname: "", email: "" });
            setToUser("");
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      setUserInfo({ nickname: "", email: "" });
      setToUser("");
    }
  }, [debouncedFriendNickname]);

  const handleNameChange = async event => {
    setfriendNickname(event.target.value);
  };

  function requestFriend() {
    console.log(fromUser);
    console.log(toUser);

    const requestData = {
      fromUser: fromUser,
      toUser: toUser,
    };

    axios
      .post("https://i9b109.p.ssafy.io:8443/friend/request", requestData, {
        headers: {
          Authorization: "Bearer " + getCookie("access"),
        },
      })
      .then(response => {
        if (response.status === 200) {
          console.log("친구 요청 성공");
          setSuccessDialogOpen(true);
          // alert("친구 요청이 성공적으로 보내졌습니다!");
        } else {
          console.error("친구 요청 실패:", response.data);
        }
      })
      .catch(error => {
        console.error("친구 요청 중 오류 발생:", error);
      });

    if (stomp.connected) {
      stomp.send("/public/request", {}, JSON.stringify(requestData));
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          backgroundColor: "rgba(50, 50, 255, 0.9)",
          color: "#ffffff",
          padding: "50px",
          width: "500px",
          fontFamily: 'Ramche',
        }}
      >
        <h2 style={{ textAlign: "center", fontFamily: 'Ramche', }}>친구 추가</h2>

        <TextField
          label="닉네임 입력"
          variant="outlined"
          fullWidth
          value={friendNickname}
          onChange={handleNameChange}
          style={{ marginBottom: "30px", fontFamily: 'Ramche', }}
          inputProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
          InputLabelProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
        />
        <List>
          {UserInfo.nickname && UserInfo.email && (
            <ListItem>
              <ListItemText
                primary={`닉네임: ${UserInfo.nickname}`}
                secondary={`이메일: ${UserInfo.email}`}
              />
            </ListItem>
          )}
        </List>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgba(0, 128, 255, 0.1)",
              width: "100px",
              fontFamily: 'Ramche',
            }}
            onClick={() => {
              handleClose();
              requestFriend();
            }}
          >
            요청
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgba(0, 128, 255, 0.1)",
              width: "100px",
              fontFamily: 'Ramche',
            }}
            onClick={handleClose}
          >
            취소
          </Button>
        </Stack>

        {/* 친구 요청 성공 : Dialog */}
        <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
          <DialogTitle>성공</DialogTitle>
          <DialogContent>
            친구 요청이 성공적으로 보내졌습니다!
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSuccessDialogClose} color="primary">
              확인
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Modal>
  );
}

export default AddFriend;
