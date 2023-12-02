/*eslint-disable*/
import { useState, useEffect } from "react";
import { React, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { userInfo } from "../../apis/userInfo";
import SelectImageModal from "./My_ModifyPhoto";
import Button from "@mui/material/Button";
import axios from "axios";
import "./My_ModifyInfo.css";

function UserInfo(props) {
  const navigate = useNavigate();

  // 상태 변수 추가
  const [nicknameEdit, setNicknameEdit] = useState(false);
  const [passwordEdit, setPasswordEdit] = useState(false);

  //이전 비밀번호
  const [oldPassWord, setOldPassWord] = useState("");

  // 비밀번호 수정 관련 상태 변수 추가
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);

  // 비밀번호 확인 관련 상태 변수 추가
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMatchPassword, setIsMatchPassword] = useState(false);
  const [photo, setPhoto] = useState("");
  const fileInput = useRef();

  const profileImagePath = `/images/${photo}.png`;

  // 모달의 상태를 관리하는 상태 변수
  const [showModal, setShowModal] = useState(false);

  // 이미지 선택 모달을 열기
  const handleFileOpen = () => {
    setShowModal(true);
  };

  // 모달을 열기 위한 핸들러
  const openModal = () => {
    setShowModal(true);
  };

  // 모달을 닫기 위한 핸들러
  const closeModal = () => {
    setShowModal(false);
  };

  // 이미지 선택 후의 동작을 정의한 핸들러
  const handleImageSelect = (selectedImage) => {
    setPhoto(selectedImage); // 선택한 이미지로 상태 업데이트
  };

  // 비밀번호 유효성 검사 함수
  const checkPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  //닉네임 인증
  const [nickNameCheckStatus, setNickNameCheckStatus] = useState(false);

  const nickNameCheck = async () => {
    try {
      const response = await axios.get(
        `https://i9b109.p.ssafy.io:8443/member/nickname?nickname=${nickname}`
      );
      if (response.data.duplicate === false) {
        setNickNameCheckStatus(true);
        window.confirm("사용 가능한 닉네임입니다.");
      } else {
        console.log(response);
        setNickNameCheckStatus(false);
        window.confirm("사용중인 닉네임입니다.");
      }
    } catch (error) {
      console.log(error);
      window.confirm("오류가 발생했습니다.");
    }
  };

  //닉네임 변경
  const nickNameModify = async () => {
    const access = getCookie("access");
    try {
      if (nickNameCheckStatus === true) {
        const response = await axios.patch(
          // "http://localhost:8080/member/nickname",
          "https://i9b109.p.ssafy.io:8443/member/nickname",
          {
            email: getCookie("email"),
            nickname: nickname,
          },
          {
            headers: {
              Authorization: "Bearer " + access,
            },
          }
        );
        if (response.status === 200) {
          window.confirm("닉네임이 변경되었습니다.");
          setNicknameEdit(!nicknameEdit);
          navigate("/MyModify");
        } else {
          throw new Error();
        }
      } else {
        window.confirm("닉네임 중복 확인을 해주세요.");
      }
    } catch (error) {
      console.log(error);
      window.confirm("닉네임 변경에 실패했습니다.");
    }
  };

  //비밀번호 변경
  const changePW = async () => {
    const access = getCookie("access");
    if (oldPassWord === password) {
      window.confirm("새 비밀번호가 현재 비밀번호와 동일합니다.");
    } else if (password === confirmPassword && isValidPassword === true) {
      try {
        const response = await axios.patch(
          "https://i9b109.p.ssafy.io:8443/member/pw",
          {
            email: getCookie("email"),
            oldPassword: oldPassWord,
            newPassword: password,
          },
          {
            headers: {
              Authorization: "Bearer " + access,
            },
          }
        );
        if (response.status === 200) {
          window.confirm("비밀번호가 변경되었습니다.");
          setPasswordEdit(!passwordEdit);
          navigate("/MyModify");
        } else if (response.status === 400) {
          window.confirm("이전 비밀번호가 틀렸습니다.");
        } else {
          window.confirm("오류가 발생했습니다.");
        }
      } catch (error) {
        console.log(error);
        window.confirm("오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await userInfo();
        if (res.status === 200) {
          setPhoto(res.data.profile_img_seq);
        }
      } catch (error) {
        window.alert("로그인을 해주세요!");
        navigate("/");
        console.log(error);
      }
    };
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    // 비밀번호가 비어있지 않은 경우에만 유효성 검사 수행
    setIsValidPassword(checkPassword(password));
    setIsMatchPassword(password === confirmPassword);
  }, [password, confirmPassword]);

  function ImageSelectModal({ onSelect, onClose }) {
    const images = ["1.png", "2.png", "3.png", "4.png"];

    return (
      <div className="image-select-modal">
        {images.map((image, index) => (
          <img
            key={index}
            src={`/images/${image}`}
            alt={`Option ${index}`}
            onClick={() => {
              onSelect(image);
              onClose();
            }}
          />
        ))}
        <button onClick={onClose}>닫기</button>
      </div>
    );
  }

  return (
    <div className="mainn-container">
      <div className="modify-info-container">
        <div className="modify-info">
          <div className="modify-item">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                fontFamily: 'Ramche',
              }}
            >
              <span className="modify-name" style={{fontFamily: 'Ramche',}}>닉네임</span>
              <span className="modify-value" style={{fontFamily: 'Ramche',}}>{props.nickName}</span>
              <Button
                className="modify-value-button"
                style={{ left: "100px", fontWeight: "bolder", fontFamily: 'Ramche', }}
                sx={{ color: "white", ":hover": { color: "blue" } }}
                onClick={() => setNicknameEdit(!nicknameEdit)}
              >
                수정
              </Button>
            </div>
            {nicknameEdit && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  right: "100px",
                  top: "30px",
                  position: "absolute",
                  width: "600px",
                  fontFamily: 'Ramche',
                }}
              >
                <span className="modify-nickName-name" style={{fontFamily: 'Ramche',}}>닉네임 수정</span>
                <input
                  type="text"
                  className="modify-input"
                  value={nickname}
                  placeholder={props.nickName}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNickNameCheckStatus(false);
                  }}
                />
                <Button
                  style={{
                    minWidth: "90px",
                    top: "20px",
                    fontWeight: "bolder",
                    fontFamily: 'Ramche',
                  }}
                  sx={{ color: "white", ":hover": { color: "blue", fontFamily: 'Ramche', } }}
                  onClick={nickNameCheck}
                >
                  중복 확인
                </Button>
                <Button
                  className="fin"
                  style={{
                    minWidth: "50px",
                    top: "20px",
                    fontWeight: "bolder",
                  }}
                  sx={{ color: "white", ":hover": { color: "red", fontFamily: 'Ramche', } }}
                  onClick={nickNameModify}
                >
                  완료
                </Button>
              </div>
            )}
          </div>
          <div className="modify-item">
            <div style={{ display: "flex", alignItems: "center", fontFamily: 'Ramche', }}>
              <span className="modify-name" style={{fontFamily: 'Ramche',}}>비밀 번호</span>
              <span className="modify-value" style={{fontFamily: 'Ramche',}}>****</span>

              <Button
                className="modify-value-button"
                style={{ left: "90px", fontWeight: "bolder", fontFamily: 'Ramche', }}
                sx={{ color: "white", ":hover": { color: "blue", fontFamily: 'Ramche', } }}
                onClick={() => setPasswordEdit(!passwordEdit)}
              >
                수정
              </Button>
            </div>
            {passwordEdit && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    right: "100px",
                    top: "30px",
                    position: "absolute",
                    width: "600px",
                    fontFamily: 'Ramche',
                  }}
                >
                  <span className="modify-password-name" style={{fontFamily: 'Ramche',}}>현재 비밀번호</span>
                  <input
                    type="password"
                    className="modify-input"
                    placeholder="현재 비밀번호"
                    value={oldPassWord}
                    onChange={(e) => setOldPassWord(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    right: "100px",
                    top: "90px",
                    position: "absolute",
                    width: "600px",
                    fontFamily: 'Ramche',
                  }}
                >
                  <span className="modify-password-name" style={{fontFamily: 'Ramche',}}>
                    &nbsp;&nbsp;새 비밀번호&nbsp;&nbsp;
                  </span>
                  <input
                    type="password"
                    className="modify-input"
                    placeholder="영어,숫자,특수 기호 포함 8자리 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {isValidPassword && password && (
                    <img
                      src={"/images/체크.png"}
                      alt="Check"
                      className="Join-check"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "35px",
                        fontFamily: 'Ramche',
                      }}
                    />
                  )}
                  {!isValidPassword && password && (
                    <img
                      src={"/images/오답.png"}
                      alt="Check"
                      className="Join-check"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "35px",
                        fontFamily: 'Ramche',
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    right: "100px",
                    top: "150px",
                    position: "absolute",
                    width: "600px",
                    fontFamily: 'Ramche',
                  }}
                >
                  <span className="modify-password-name" style={{fontFamily: 'Ramche',}}>비밀번호 확인</span>
                  <input
                    type="password"
                    className="modify-input"
                    placeholder="영어,숫자,특수 기호 포함 8자리 이상"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  {password === confirmPassword && confirmPassword && (
                    <img
                      src={"/images/체크.png"}
                      alt="Check"
                      className="Join-check"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "35px",
                        fontFamily: 'Ramche',
                      }}
                    />
                  )}
                  {password !== confirmPassword && confirmPassword && (
                    <img
                      src={"/images/오답.png"}
                      alt="Check"
                      className="Join-check"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginTop: "35px",
                        fontFamily: 'Ramche',
                      }}
                    />
                  )}
                  <Button
                    color="warning"
                    style={{
                      minWidth: "50px",
                      top: "20px",
                      fontWeight: "bolder",
                      fontFamily: 'Ramche',
                    }}
                    sx={{ color: "white", ":hover": { color: "red", fontFamily: 'Ramche', } }}
                    onClick={changePW}
                  >
                    변경
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="profile-container">
          <img
            src={profileImagePath}
            className="profile-picture"
            alt="Profile"
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              className="modify-button"
              style={{
                backgroundColor: "#F2BED1",
                color: "#000000",
                fontWeight: "bold",
                fontFamily: 'Ramche',
              }}
              onClick={handleFileOpen}
            >
              사진 변경
            </Button>
            <input
              type="file"
              style={{ display: "none", fontFamily: 'Ramche', }}
              ref={fileInput}
              // onChange={handleFileChange}
            />
          </div>
          {/* <Button
            variant="contained"
            color="primary"
            className="complete-button"
            style={{
              backgroundColor: "#F2BED1",
              color: "#000000",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/MyPage")}
          >
            수정 완료
          </Button> */}
        </div>
      </div>

      <SelectImageModal
        isOpen={showModal}
        handleClose={closeModal}
        onSelect={handleImageSelect}
      />
    </div>
  );
}

export default UserInfo;
