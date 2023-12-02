import { Typography, Container, Grid } from "@mui/material";
import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NextToHome() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    if (seconds === 0) {
      navigate(`/`);
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
        marginTop={5}
      >
        <Grid item>
          <Typography variant="h5" style={{ fontFamily: "Ramche" }}>
            {seconds}초 홈 화면으로 넘어갑니다.&nbsp;&nbsp;
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

export default NextToHome;
