import { React, useEffect, useState } from "react";
import "./My_JoinInfo.css";
import Button from "@mui/material/Button";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Radio, RadioGroup, FormControlLabel, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const JoinInfo = ({ onJoinInfo, profileImgSeq }) => {
  const [name, setName] = useState("");
  const [gender, setgender] = useState("");
  const [nickname, setnickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeStatus, setEmailCodeStatus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [nickNameStatus, setNickNameStatus] = useState(false);

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

  useEffect(() => {
    const passwordRegex = new RegExp(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/
    );
    setIsPasswordValid(passwordRegex.test(password));
  }, [password]);

  // 부모 컴포넌트에 데이터 전달
  useEffect(() => {
    if (onJoinInfo) {
      onJoinInfo({
        name,
        nickname,
        email,
        password,
        passwordConfirm,
        profile_img_seq: profileImgSeq,
        emailCodeStatus,
        isPasswordValid,
        nickNameStatus,
        gender,
      });
    }
  }, [
    name,
    email,
    password,
    passwordConfirm,
    gender,
    nickname,
    onJoinInfo,
    emailCodeStatus,
    isPasswordValid,
    nickNameStatus,
    profileImgSeq,
  ]);

  // 상태가 변경될 때마다 콜백 함수를 호출

  //이메일 코드 전송
  const emailCheck = async () => {
    try {
      const response = await axios.post(
        // `http://localhost:8080/member/mail?email=${email}`
        `https://i9b109.p.ssafy.io:8443/member/mail?email=${email}`
      );
      if (response.status === 200) {
        setEmailCodeStatus(false);
        handleOpenDialog("인증번호가 발송되었습니다.")
      }
    } catch (error) {
      console.log(error);
      handleOpenDialog("인증번호 발송을 실패하였습니다.")
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
        handleOpenDialog("인증되었습니다.");
      } else {
        setEmailCodeStatus(false);
        handleOpenDialog("인증을 실패하였습니다.");
      }
    } catch (error) {
      console.log(error);
      handleOpenDialog("인증을 실패하였습니다.");
    }
  };

  // 이메일 인증 이미지
  const showEmailImage = () => {
    if (emailCodeStatus) {
      return (
        <img
          src={"/images/체크.png"}
          alt="확인 사진"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
      );
    } else {
      return null;
    }
  };

  //닉네임 인증
  const nickNameCheck = async () => {
    try {
      const response = await axios.get(
        // `http://localhost:8080/member/nickname?nickname=${nickname}`
        `https://i9b109.p.ssafy.io:8443/member/nickname?nickname=${nickname}`
      );
      if (response.data.duplicate === false) {
        setNickNameStatus(true);
        handleOpenDialog("사용 가능한 닉네임입니다.");
      } else {
        setNickNameStatus(false);
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      setNickNameStatus(false);
      handleOpenDialog("사용중인 닉네임입니다.");
    }
  };

  // 닉네임 인증 이미지
  const showNickNameImage = () => {
    if (nickNameStatus) {
      return (
        <img
          src={"/images/체크.png"}
          alt="확인 사진"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <div className="Join-info-container">
      <div className="Join-info" style={{ width: "60vw" }}>
        {/* 이름 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name Join-name-topline" style={{ fontFamily: 'Ramche', }}>이름</span>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              // 레이블이 항상 위로 올라가 있게 한다
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
        </div>
        {/* 성별 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>성별</span>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={gender}
            onChange={(e) => setgender(e.target.value)}
            style={{ marginLeft: "40%", fontFamily: 'Ramche', }}
          >
            <FormControlLabel
              value="M"
              control={<Radio color="primary" />}
              label="남자"
            />
            <FormControlLabel
              value="F"
              control={<Radio color="primary" />}
              label="여자"
            />
          </RadioGroup>
        </div>
        {/* 닉네임 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>닉네임</span>
          <TextField
            fullWidth
            value={nickname}
            onChange={(e) => {
              setnickname(e.target.value);
              setNickNameStatus(false);
            }}
            variant="outlined"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                padding: "10px 14px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={nickNameCheck} // 닉네임 중복 확인 함수
            style={{ width: "45%", fontFamily: 'Ramche', marginLeft: "10px", marginRight: "10px"}}
          >
            중복 확인
          </Button>
          {showNickNameImage()} {/* 닉네임 중복 확인 이미지 */}
        </div>
        {/* 이메일 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>이메일</span>
          <TextField
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                padding: "10px 14px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
          <Button variant="contained" color="primary" onClick={emailCheck} style={{ fontFamily: 'Ramche',marginLeft: "10px", marginRight: "10px" }}>
            인증
          </Button>
        </div>
        {/* 이메일 인증 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>이메일 인증</span>
          <TextField
            fullWidth
            value={emailCode}
            onChange={(e) => {
              setEmailCode(e.target.value);
              setEmailCodeStatus(false);
            }}
            variant="outlined"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                padding: "10px 14px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={emailCodeCheck} // 이메일 인증 확인 함수
            style={{ width: "45%", fontFamily: 'Ramche', marginLeft: "10px", marginRight: "10px"}}
          >
            인증 확인
          </Button>
          {showEmailImage()} {/* 이메일 인증 이미지 */}
        </div>
        {/* 비밀번호 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>비밀 번호</span>
          <TextField
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            helperText="영어, 숫자, 특수기호 포함 8자리 이상"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                padding: "10px 14px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
          {isPasswordValid && password && (
            <img
              src={"/images/체크.png"}
              alt="Check"
              className="Join-check"
              style={{ width: "40px", height: "40px", marginRight: "-15px", fontFamily: 'Ramche', }}
            />
          )}
          {!isPasswordValid && password && (
            <span className="Join-warning" style={{ color: "red", fontFamily: 'Ramche', }}>
              <img
                src={"/images/오답.png"}
                alt="Check"
                className="Join-check password-check"
                style={{ width: "40px", height: "40px", marginRight: "-15px", fontFamily: 'Ramche', }}
              />
            </span>
          )}
        </div>
        {/* 비밀번호 확인 입력 필드 */}
        <div className="Join-item">
          <span className="Join-name" style={{ fontFamily: 'Ramche', }}>비밀 번호 확인</span>
          <TextField
            fullWidth
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            variant="outlined"
            style={{ marginLeft: "40%", height: "40px", fontFamily: 'Ramche', }}
            InputProps={{
              style: {
                height: "40px",
                padding: "10px 14px",
                fontFamily: 'Ramche',
              },
            }}
            InputLabelProps={{
              shrink: true,
              style: {
                fontSize: "0.8rem",
                transform: "scale(1) translate(14px, 10px)",
                fontFamily: 'Ramche',
              },
            }}
          />
          {password === passwordConfirm && passwordConfirm && (
            <span className="Join-warning" style={{ color: "red", fontFamily: 'Ramche', }}>
              <img
                src={"/images/체크.png"}
                alt="Check"
                className="Join-check"
                style={{ width: "40px", height: "40px", marginRight: "-15px", fontFamily: 'Ramche', }}
              />
            </span>
          )}
          {password !== passwordConfirm && passwordConfirm && (
            <span className="Join-warning" style={{ color: "red", fontFamily: 'Ramche', }}>
              <img
                src={"/images/오답.png"}
                alt="Check"
                className="Join-check"
                style={{ width: "40px", height: "40px", marginRight: "-15px", fontFamily: 'Ramche', }}
              />
            </span>
          )}
        </div>
      </div>
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

export default JoinInfo;