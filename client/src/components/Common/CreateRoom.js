/* eslint-disable */
import {
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { createSession } from "../../openvidu/sessionInitialization";
import { setSession, setGameseq } from "../../store";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCookie } from "../../utils/cookie";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateRoom({ isOpen, handleClose }) {
  const dispatch = useDispatch(); // Redux
  const navigate = useNavigate(); // 페이지 이동
  const [isSecret, setIsSecret] = useState("일반 방"); // 모드
  const [password, setPassword] = useState(""); // 비밀방 암호
  const [title, setTitle] = useState(uuidv4()); // 방 제목
  const [songSeq, setSongSeq] = useState(""); // 노래 번호 (Integer)
  const [allSongs, setAllSongs] = useState([]); // 모든 노래 정보 상태
  const [searchTerm, setSearchTerm] = useState(""); // 노래 검색어 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

  // 모든 노래 정보 가져오기
  useEffect(() => {
    axios
      .get(`https://i9b109.p.ssafy.io:8443/music`, {
        headers: {
          Authorization: "Bearer " + getCookie("access"),
        },
      })
      .then((response) => {
        setAllSongs(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // 검색어 변경 시 검색 결과 필터링
  useEffect(() => {
    if (searchTerm) {
      const results = allSongs.filter((song) =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, allSongs]);

  const handleSongChange = (event) => {
    setSongSeq(event.target.value);
    setSearchTerm(event.target.value);
  };

  const handleModeChange = (event) => {
    setIsSecret(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const selectSong = (song) => {
    setSongSeq(song.songSeq);
    setSearchTerm(song.title); // 선택한 노래의 제목을 표시
    setSearchResults([]); // 검색 결과를 초기화하여 목록을 숨김
    // dispatch(setSongTitle(song.title)); // 선택한 노래의 제목을 Redux에 저장
  };

  const handleCreateRoom = async () => {
    // 1. 사용자가 선택한 노래 제목의 유효성 검사
    const songExists = allSongs.some((song) => song.songSeq === songSeq);

    if (!songExists) {
      // 2. 유효성 검사가 실패하면 모달 알림창을 표시
      alert("노래 제목을 확인해주세요!");
      return;
    }

    // 3. 유효성 검사가 통과되면 방을 만듭니다.
    try {
      const sessionResponse = await createSession();
      
      if (sessionResponse != null) {
        const response = await axios.post(
          "https://i9b109.p.ssafy.io:8443/lobby/room",
          {
            title: title,
            songSeq: songSeq,
            isSecret: isSecret === "비밀 방" ? 1 : 0,
            password: password,
            sessionId: sessionResponse.id,
          },
          {
            headers: {
              Authorization: "Bearer " + getCookie("access"),
            },
          }
        );
        console.log("방 만들어졌습니다~ 세션아이디 : " + sessionResponse.id);
        console.log("방 만들어졌습니다~ gameseq : ", response.data.data);
        dispatch(setSession(sessionResponse.id));
        dispatch(setGameseq(response.data.data));
        navigate(`/GameWait/${response.data.data}`, {
          state: { data: songSeq },
        });
      }
    } catch (error) {
      console.error("세션을 받지 못했죠~", error);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(50, 100, 255, 0.9)",
          color: "#ffffff",
          padding: "50px",
          width: "500px", // 여기서 너비를 설정합니다.
          height: "500px", // 여기서 높이를 설정합니다.
          overflowY: "auto", // 내용이 너무 많으면 스크롤바가 생깁니다.
          fontFamily: 'Ramche',
        }}
      >
        <img
          src="/images/CreateRoom.gif"
          alt="망치질"
          style={{
            width: "100px",
            display: "block",
            margin: "auto",
            padding: "3%",
            fontFamily: 'Ramche',
          }}
        />

        <TextField
          label="방 제목"
          variant="outlined"
          fullWidth
          style={{
            marginBottom: "20px",
            backgroundColor: "rgba(0, 128, 255, 0.1)",
            fontFamily: 'Ramche',
          }}
          onChange={(event) => setTitle(event.target.value)}
          inputProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
          InputLabelProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
        />
        <TextField
          label="노래 제목"
          variant="outlined"
          fullWidth
          style={{
            marginBottom: "20px",
            backgroundColor: "rgba(0, 128, 255, 0.1)",
            fontFamily: 'Ramche',
          }}
          value={searchTerm}
          onChange={handleSongChange}
          inputProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
          InputLabelProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }}
        />
        {searchResults.map((song) => (
          <div
            key={song.songSeq}
            style={{ marginBottom: "3%", cursor: "pointer", fontFamily: 'Ramche', }}
            onClick={() => selectSong(song)}
          >
            {song.title} - {song.singer}
          </div>
        ))}
        <FormControl
          component="fieldset"
          style={{ marginBottom: "20px", marginLeft: "10px", fontFamily: 'Ramche', }}
        >
          <FormLabel component="legend" style={{ color: "#ffffff", fontFamily: 'Ramche', }}>
            모드
          </FormLabel>
          <RadioGroup
            row
            aria-label="isSecret"
            name="row-radio-buttons-group"
            value={isSecret}
            onChange={handleModeChange}
          >
            <FormControlLabel
              value="일반 방"
              control={<Radio style={{ color: "#ffffff", fontFamily: 'Ramche', }} />}
              label={<span style={{ color: "#ffffff", fontFamily: 'Ramche' }}>일반 방</span>}
            />
            <FormControlLabel
              value="비밀 방"
              control={<Radio style={{ color: "#ffffff", fontFamily: 'Ramche', }} />}
              label={<span style={{ color: "#ffffff", fontFamily: 'Ramche' }}>비밀 방</span>}
            />
          </RadioGroup>
        </FormControl>
        {isSecret === "비밀 방" && (
          <TextField
            type="password"
            label="비밀번호"
            variant="outlined"
            fullWidth
            value={password}
            onChange={handlePasswordChange}
            style={{ marginBottom: "20px", fontFamily: 'Ramche', }}
            inputProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }} // 입력 텍스트의 색상을 흰색으로 설정
            InputLabelProps={{ style: { color: "#ffffff", fontFamily: 'Ramche', } }} // 라벨 텍스트의 색상을 흰색으로 설정
          />
        )}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            onClick={handleCreateRoom}
            style={{ backgroundColor: "rgba(0, 128, 255, 0.1)", fontFamily: 'Ramche', }}
          >
            방 만들기
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            style={{ backgroundColor: "rgba(0, 128, 255, 0.1)", fontFamily: 'Ramche', }}
          >
            취소
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

export default CreateRoom;
