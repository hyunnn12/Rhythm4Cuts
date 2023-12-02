// Join.js
import { React, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import JoinImage from "../../components/My/My_JoinImage";
import JoinInfo from "../../components/My/My_JoinInfo";
import Button from "@mui/material/Button";
import Header from "../../components/Home/Header";
import axios from "axios";
import "./Join.css";
import { Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function Join() {
  const [profileImgSeq, setProfileImgSeq] = useState(1); // profile_img_seq를 상태로 관리

  // 모달
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const handleOpenDialog = (message) => {
    setDialogMessage(message);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleImageSelect = useCallback((index) => {
    console.log("Selected Image Index:", index);
    setProfileImgSeq(index);
  }, []);

  const navigate = useNavigate();

  // 회원가입 정보를 저장할 상태
  const [joinInfo, setJoinInfo] = useState({});

  const handleJoinInfo = useCallback((data) => {
    setJoinInfo(data); // JoinInfo 컴포넌트로부터 받은 데이터를 상태에 저장
  }, []);

  //회원가입
  const handleJoinComplete = async () => {

    if (joinInfo.nickNameStatus === false) {
      handleOpenDialog("닉네임 중복확인하세요.");
      // window.confirm("닉네임 중복확인하세요.");
    } else if (joinInfo.emailCodeStatus === false) {
      handleOpenDialog("이메일 인증확인하세요.")
    } else if (
      joinInfo.isPasswordValid === false ||
      joinInfo.password !== joinInfo.passwordConfirm
    ) {
      handleOpenDialog("비밀번호 확인하세요.")
    } else {
      try {
        await axios.post(
          "https://i9b109.p.ssafy.io:8443/member/register",
          joinInfo
        );
        navigate("/Login");
      } catch (error) {
        console.error("회원가입하는데 에러 발생 : " + error);
      }
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#c1b3ff",
      }}
    >
      {/* 헤더 */}
      <Header></Header>

      {/* 캐릭터 고르기 */}
      <Grid style={{ display: "flex", width: "30%" }}>
        <JoinImage
          initialImages={[
            "/images/1.png",
            "/images/2.png",
            "/images/3.png",
            "/images/4.png",
          ]}
          onImageSelect={handleImageSelect}
        />
        <JoinInfo onJoinInfo={handleJoinInfo} profileImgSeq={profileImgSeq} />
      </Grid>

      {/* 바닥 */}
      <Button
        color="primary"
        style={{
          color: "black",
          fontSize: "large",
          float: "right",
          marginRight: "200px",
          marginTop: "-100px",
        }}
        onClick={handleJoinComplete}
      >
        가입 완료
      </Button>

      {/* 모달 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"알림"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Join;
