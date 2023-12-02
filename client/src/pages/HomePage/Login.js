// Login.js
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useWebSocket } from "../../utils/WebSocket/WebSocket";
import { setCookie } from "../../utils/cookie";
import { login } from "../../apis/login";
import SearchPassword from "../../components/Common/SearchPassword";
import LoginCheck from '../../components/Common/LoginCheck';
import "./Login.css";

const Login = () => {
  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  let navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenSearchPasswordModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseSearchPasswordModal = () => {
    setIsModalOpen(false);
  };

  // 알람
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [isFailureAlertOpen, setIsFailureAlertOpen] = useState(false);

  // id 파트
  const [id, setId] = useState("");
  const onChangeId = (e) => {
    setId(e.target.value);
  };

  // pw 파트
  const [pw, setPW] = useState("");
  const onChangePW = (e) => {
    setPW(e.target.value);
  };

  const onKeyPress = (e) => {
    if (e.key === "Enter") {
      Login();
    }
  };

  // const { connectWebSocket } = useWebSocket(); // 웹소켓 연결 함수 가져오기

  // 로그인
  const Login = async () => {
    try {
      const result = await login(id, pw);
      if (result.status === 200) {
        setCookie("access", result.data.accessToken);
        setCookie("refresh", result.data.refreshToken);
        setCookie("email", result.data.email);
        setIsSuccessAlertOpen(true);
        // connectWebSocket(); // 로그인 성공 후 웹소켓 연결 시작
      } else {
        setIsFailureAlertOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setIsFailureAlertOpen(true);
      } else {
        window.alert("서버와의 통신 중 에러가 발생했습니다!");
      }
    }
  };



  return (
    <div className="bg" >
      <video autoPlay loop muted>
        <source src="/videos/33.mp4" type="video/mp4" />
      </video>
      <div className="outer">
        <div className="logo">
          <a href="/">
            <img
              alt="로고 사진"
              src="images/Home_Logo.png"
              style={{ marginLeft: "50px", marginTop: "25px" }}
            ></img>
          </a>
        </div>

        <div className="input">
          <input
            type="text"
            ref={emailRef}
            placeholder="이메일"
            value={id}
            onChange={onChangeId}
            onKeyPress={onKeyPress}
          ></input>
        </div>
        <div className="input">
          <input
            placeholder="비밀번호"
            type="password"
            value={pw}
            onChange={onChangePW}
            onKeyPress={onKeyPress}
          ></input>
        </div>
        <div className="login">
          <button type="submit" onClick={Login}>
            로그인
          </button>
        </div>
        <div className="searchAndJoin">
          <button onClick={handleOpenSearchPasswordModal}>PW찾기</button>
          <div style={{ color: "white", margin: "7px" }}>|</div>
          <Link to="/Join" style={{ color: "white" }}>
            회원가입
          </Link>
        </div>
        {/* <div className="apiLogin">
          <div className="naver-logo"></div>
          <div className="kakao-logo"></div>
        </div> */}
      </div>

      <SearchPassword
        isOpen={isModalOpen}
        handleClose={handleCloseSearchPasswordModal}
      />

      {/* 로그인 성공 알림 */}
      <LoginCheck
        isOpen={isSuccessAlertOpen}
        onConfirm={true}
        onClose={() => {
          setIsSuccessAlertOpen(false);
          navigate("/"); // 메인 페이지로 이동
        }}
      />

      {/* 로그인 실패 알림 */}
      <LoginCheck
        isOpen={isFailureAlertOpen}
        onConfirm={false}
        onClose={() => setIsFailureAlertOpen(false)}
      />

    </div>

  );
};

export default Login;
