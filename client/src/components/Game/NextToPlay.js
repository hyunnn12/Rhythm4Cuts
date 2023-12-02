import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Container, Grid } from "@mui/material";

function NextToPlay() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(1000);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (seconds === 0) {
      navigate("/GamePlay");
      clearInterval(countdown);
    }

    return () => {
      clearInterval(countdown);
    };
  }, [seconds, navigate]);

  return (
    <Container>
      <Grid container justifyContent="flex-end" alignItems="center" spacing={2}>
        <Grid item>
          <Typography variant="h5" style={{ color: "white", fontFamily: 'Ramche', }}>
            게임이 {seconds}초 후 시작합니다!!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NextToPlay;
