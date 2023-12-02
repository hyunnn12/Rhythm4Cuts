import { Modal, Box, TextField, Button } from "@mui/material";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchPassword({ isOpen, handleClose }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeStatus, setEmailCodeStatus] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value); // 아이디 변경 이벤트 핸들러
  };

  const handleEmailCodeChange = (event) => {
    setEmailCode(event.target.value); // 이메일 변경 이벤트 핸들러
  };

  //이메일 코드 전송
  const emailCheck = async () => {
    try {
      const response = await axios.post(
        // `http://localhost:8080/member/mail?email=${email}`
        `https://i9b109.p.ssafy.io:8443/member/mail?email=${email}`
      );
      if (response.status === 200) {
        setEmailCodeStatus(false);
        window.confirm("인증번호가 발송되었습니다.");
      }
    } catch (error) {
      console.log(error);
      window.confirm("인증번호 발송을 실패하였습니다.");
    }
  };

  //이메일 코드 인증
  const emailCodeCheck = async () => {
    try {
      const response = await axios.post(
        // "http://localhost:8080/member/mailcheck",
        `https://i9b109.p.ssafy.io:8443/member/mailcheck`,
        {
          email: email,
          certificate: emailCode,
        }
      );
      if (response.data.checked === true) {
        setEmailCodeStatus(true);
        window.confirm("인증되었습니다.");
      } else {
        setEmailCodeStatus(false);
        window.confirm("인증을 실패하였습니다.");
      }
    } catch (error) {
      console.log(error);
      window.confirm("오류가 발생하였습니다.");
    }
  };

  //비밀번호 재설정
  const resetPW = async () => {
    if (emailCodeStatus === true) {
      try {
        const response = await axios.post(
          `https://i9b109.p.ssafy.io:8443/member/pw?email=${email}`
        );
        if (response.status === 200) {
          window.confirm("임시 비밀번호가 전송되었습니다.");
          navigate("/");
        } else {
          window.confirm("비밀번호 재설정에 실패했습니다.");
        }
      } catch (error) {
        console.log(error);
        window.confirm("이메일이 틀렸거나 존재하지 않습니다.");
      }
    } else {
      window.confirm("인증번호를 확인해주세요.");
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        style={{ textAlign: "center", fontFamily: 'Ramche', }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          fontFamily: 'Ramche',
        }}
      >
        <h3 style={{ textAlign: "center", fontFamily: 'Ramche', }}>비밀번호 찾기</h3>
        <TextField
          label="이메일 입력"
          variant="outlined"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          sx={{ width: 3 / 4 }}
          style={{ marginBottom: "20px", fontFamily: 'Ramche', }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mx: 2, my: 1 }}
          onClick={emailCheck}
          style={{fontFamily: 'Ramche',}}
        >
          인증
        </Button>
        <TextField
          label="인증번호 입력"
          variant="outlined"
          fullWidth
          value={emailCode}
          onChange={handleEmailCodeChange}
          sx={{ width: 3 / 4 }}
          style={{ marginBottom: "20px", fontFamily: 'Ramche', }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mx: 2, my: 1 }}
          onClick={emailCodeCheck}
          style={{fontFamily: 'Ramche',}}
        >
          확인
        </Button>
        <Button variant="contained" color="primary" onClick={resetPW} style={{fontFamily: 'Ramche',}}>
          비밀번호 재설정
        </Button>
      </Box>
    </Modal>
  );
}

export default SearchPassword;
