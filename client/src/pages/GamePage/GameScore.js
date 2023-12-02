import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import Next from "../../components/Game/NextToShot";
import Podium from "../../components/Game/Podium";
import { useNavigate, useParams } from "react-router-dom";
import LoginAlert from "../../components/Common/LoginAlert";
import { userInfo } from "../../apis/userInfo";
import Header from "../../components/Game/HeaderPlay";
import "./GameScore.css";
import { getCookie } from "../../utils/cookie";

const Root = styled("div")({
  width: "100%",
  height: "100vh",
  position: "relative",
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundImage: "url('/images/Game_Shot.png')",
  zIndex: 0,
});

const Title = styled(Typography)({
  textAlign: "center",
  marginBottom: 2,
});

const PodiumContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
});

function GameScore() {
  const navigate = useNavigate();
  const [isLoginAlertOpen, setLoginAlertOpen] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  var { gameSeq } = useParams(); // url에서 추출

  // 로그인 상태 확인
  useEffect(() => {
    userInfo()
      .then((res) => {
        if (res.status === 200) {
          // 로그인 상태일 때 axios로 데이터를 가져옴
          axios
            .get(`https://i9b109.p.ssafy.io:8443/wait/order/${gameSeq}`, {
              headers: {
                Authorization: "Bearer " + getCookie("access"),
              },
            })
            .then((response) => {
              // 가져온 데이터를 score 순서로 정렬하여 저장
              const sortedResults = response.data.sort(
                (a, b) => b.score - a.score
              );
              setGameResults(sortedResults);
            })
            .catch((error) => {
              console.error("Error fetching game results:", error);
            });
        }
      })
      .catch((error) => {
        handleOpenLoginAlert();
      });
  }, []);

  // 로그인 상태를 업데이트하는 함수
  const handleOpenLoginAlert = () => {
    setLoginAlertOpen(true);
  };
  const handleCloseLoginAlert = () => {
    setLoginAlertOpen(false);
    navigate("/Login");
  };

  return (
    <Root>
      <Header />

      <Container>
        <Title
          color={"Black"}
          fontWeight={"bolder"}
          variant="h3"
          style={{ marginBottom: "50px", fontFamily: "Ramche" }}
        >
          Score Board
        </Title>

        {/* Middle */}
        <Grid
          container
          spacing={5}
          style={{ padding: "5px", fontFamily: "Ramche" }}
        >
          {/* Middle_Left : 시상대 */}
          <Grid item xs={12} md={5}>
            <PodiumContainer style={{ margin: "10px" }}>
              {gameResults.length >= 2 && (
                <Podium
                  rank="Silver"
                  src={`/images/${gameResults[1].profile_img_seq}.png`}
                  color="#C0C0C0"
                  podiumHeight="35vh"
                  crownWidth="80%"
                />
              )}
              {gameResults.length >= 1 && (
                <Podium
                  rank="Gold"
                  src={`/images/${gameResults[0].profile_img_seq}.png`}
                  color="#FFD700"
                  podiumHeight="45vh"
                />
              )}
              {gameResults.length >= 3 && (
                <Podium
                  rank="Bronze"
                  src={`/images/${gameResults[2].profile_img_seq}.png`}
                  color="#CD7F32"
                  podiumHeight="30vh"
                />
              )}
            </PodiumContainer>
          </Grid>

          {/* Middle_Right : 점수판 */}
          <Grid item xs={12} md={7}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", fontFamily: "Ramche" }}
                      align="center"
                    >
                      순위
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", fontFamily: "Ramche" }}
                      align="center"
                    >
                      NickName
                    </TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", fontFamily: "Ramche" }}
                      align="center"
                    >
                      Score
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ fontFamily: "Ramche" }}>
                  {gameResults.map((result, index) => (
                    <TableRow key={result.userSeq}>
                      <TableCell
                        align="center"
                        component="th"
                        scope="row"
                        style={{ fontFamily: "Ramche" }}
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ fontFamily: "Ramche" }}
                      >
                        {result.nickname}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ fontFamily: "Ramche" }}
                      >
                        {80 + index * 4}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Next gameSeq={gameSeq} />
        </Grid>
      </Container>

      <LoginAlert isOpen={isLoginAlertOpen} onClose={handleCloseLoginAlert} />
    </Root>
  );
}

export default GameScore;
