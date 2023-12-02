import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import React from "react";

function PlayerComing() {
  return (
    <div>
      <Card
        sx={{
          width: "15vw",
          height: "32vh",
          position: "relative", // 추가: 로딩 스피너를 정확한 위치에 표시하기 위해 필요
          fontFamily: 'Ramche',
        }}
      >
        <CardContent>
          <img
            src="/images/꼬북이.jfif"
            alt="입장하는 중"
            style={{ width: "100%", height: "100%", objectFit: "cover", fontFamily: 'Ramche', }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // 로딩 스피너를 가운데 정렬
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        </CardContent>
        <Typography variant="body1" style={{fontFamily: 'Ramche',}}>들어오는 중 ..</Typography>
      </Card>
    </div>
  );
}

export default PlayerComing;
