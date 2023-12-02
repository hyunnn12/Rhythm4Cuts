import { Button, Typography, Container, Grid } from "@mui/material";
import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NextToShot({ gameSeq }) {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (seconds === 0) {
      navigate(`/GameShot/` + gameSeq);
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [seconds, navigate]);

  return (
    <Container>
      <Grid
        container
        justifyContent="flex-end"
        alignItems="center"
        marginTop={50}
      >
        <Grid item>
          <Typography variant="h5" style={{ fontFamily: "Ramche" }}>
            {seconds}초 후 사진 촬영 화면으로 넘어갑니다.&nbsp;&nbsp;
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/")}
            style={{ fontFamily: "Ramche" }}
          >
            나가기
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NextToShot;
