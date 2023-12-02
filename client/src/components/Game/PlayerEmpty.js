import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

function PlayerEmpty() {
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
            src="/images/Empty.png"
            alt="비어있는 상태"
            style={{ width: "10vw", objectFit: "cover", fontFamily: 'Ramche', }}
          />
        </CardContent>
        <Typography variant="body1" style={{fontFamily: 'Ramche',}}> 초대하기 </Typography>
      </Card>
    </div>
  );
}

export default PlayerEmpty;
