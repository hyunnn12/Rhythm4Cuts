import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";
// import Webcam from "./Webcam";

function PlayPlayer() {
  return (
    <div>
      <Card
        sx={{
          width: "15vw",
          height: "32vh",
          marginBottom: 2,
          fontFamily: 'Ramche',
        }}
      >
        <CardContent>
          <Card
            sx={{
              height: "15vh",
              margin: 2,
              fontFamily: 'Ramche',
            }}
          >
            {/* 사용자 카메라 */}
            {/* <Webcam /> */}
          </Card>
        </CardContent>
        <Box>
          <Typography variant="body1" style={{fontFamily: 'Ramche',}}>닉네임</Typography>
          <Typography variant="body1" style={{fontFamily: 'Ramche',}}>1 Player : 80% </Typography>
        </Box>
      </Card>
    </div>
  );
}

export default PlayPlayer;
